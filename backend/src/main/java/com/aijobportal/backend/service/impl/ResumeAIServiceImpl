package com.aijobportal.backend.service.impl;

import com.aijobportal.backend.dto.ResumeAnalysisResponse;
import com.aijobportal.backend.entity.Job;
import com.aijobportal.backend.entity.Resume;
import com.aijobportal.backend.entity.User;
import com.aijobportal.backend.exception.BadRequestException;
import com.aijobportal.backend.exception.ResourceNotFoundException;
import com.aijobportal.backend.repository.JobRepository;
import com.aijobportal.backend.repository.ResumeRepository;
import com.aijobportal.backend.repository.UserRepository;
import com.aijobportal.backend.service.ResumeAIService;
import com.aijobportal.backend.util.FileStorageUtil;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ResumeAIServiceImpl implements ResumeAIService {

    private final ResumeRepository resumeRepository;
    private final UserRepository userRepository;
    private final JobRepository jobRepository;
    private final FileStorageUtil fileStorageUtil;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${app.openai.api-key}")
    private String openAiApiKey;

    @Value("${app.openai.model}")
    private String openAiModel;

    @Value("${app.openai.base-url}")
    private String openAiBaseUrl;

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    @Override
    public ResumeAnalysisResponse analyzeResume(MultipartFile file, String userEmail) throws Exception {
        User user = getUserByEmail(userEmail);

        String extractedText = extractTextFromPdf(file);
        String filePath = fileStorageUtil.storeFile(file);

        String prompt = """
                You are an ATS resume analyzer. Analyze the resume text below and return ONLY valid JSON
                (no markdown, no commentary) with this exact shape:
                {
                  "skillsFound": ["skill1", "skill2"],
                  "missingSkills": ["skillA", "skillB"],
                  "resumeScore": 0-100,
                  "atsScore": 0-100,
                  "suggestions": ["suggestion1", "suggestion2"]
                }

                Resume text:
                """ + truncate(extractedText, 6000);

        String aiJson = callOpenAi(prompt);
        JsonNode node = objectMapper.readTree(aiJson);

        List<String> skillsFound = readStringList(node, "skillsFound");
        List<String> missingSkills = readStringList(node, "missingSkills");
        List<String> suggestions = readStringList(node, "suggestions");
        int resumeScore = node.path("resumeScore").asInt(0);
        int atsScore = node.path("atsScore").asInt(0);

        Resume resume = Resume.builder()
                .user(user)
                .fileName(file.getOriginalFilename())
                .filePath(filePath)
                .extractedText(extractedText)
                .skillsFound(String.join(",", skillsFound))
                .missingSkills(String.join(",", missingSkills))
                .atsScore(atsScore)
                .resumeScore(resumeScore)
                .build();

        resume = resumeRepository.save(resume);

        return ResumeAnalysisResponse.builder()
                .resumeId(resume.getId())
                .skillsFound(skillsFound)
                .missingSkills(missingSkills)
                .resumeScore(resumeScore)
                .atsScore(atsScore)
                .suggestions(suggestions)
                .build();
    }

    @Override
    public String generateCoverLetter(Long jobId, String userEmail) {
        User user = getUserByEmail(userEmail);
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found"));

        String prompt = "Write a concise, professional cover letter (max 300 words) for " + user.getFullName()
                + " applying to the position of " + job.getTitle() + " at " + job.getCompany().getName()
                + ". Job description: " + truncate(job.getDescription(), 2000)
                + ". Return plain text only, no markdown.";

        return callOpenAiPlainText(prompt);
    }

    @Override
    public String generateInterviewQuestions(Long jobId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found"));

        String prompt = "Generate 5 technical interview questions (numbered list, plain text) for the role of "
                + job.getTitle() + " based on this job description: " + truncate(job.getDescription(), 2000);

        return callOpenAiPlainText(prompt);
    }

    // ---------- helpers ----------

    private String extractTextFromPdf(MultipartFile file) throws Exception {
        try (PDDocument document = Loader.loadPDF(file.getBytes())) {
            PDFTextStripper stripper = new PDFTextStripper();
            return stripper.getText(document);
        }
    }

    private String truncate(String text, int max) {
        if (text == null) return "";
        return text.length() > max ? text.substring(0, max) : text;
    }

    private List<String> readStringList(JsonNode node, String field) {
        List<String> result = new ArrayList<>();
        JsonNode arr = node.path(field);
        if (arr.isArray()) {
            arr.forEach(n -> result.add(n.asText()));
        }
        return result;
    }

    /** Calls OpenAI chat completions endpoint and returns the raw text content of the reply. */
    private String callOpenAiRaw(String prompt) {
        if (openAiApiKey == null || openAiApiKey.isBlank()) {
            throw new BadRequestException("OpenAI API key is not configured. Set OPENAI_API_KEY.");
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(openAiApiKey);

        var body = new java.util.HashMap<String, Object>();
        body.put("model", openAiModel);
        body.put("messages", List.of(
                java.util.Map.of("role", "user", "content", prompt)
        ));

        HttpEntity<Object> entity = new HttpEntity<>(body, headers);
        JsonNode response = restTemplate.postForObject(openAiBaseUrl, entity, JsonNode.class);

        return response.path("choices").get(0).path("message").path("content").asText();
    }

    private String callOpenAi(String prompt) {
        String content = callOpenAiRaw(prompt);
        // Strip markdown code fences if the model wraps the JSON in ```json ... ```
        return content.replaceAll("(?s)```json", "").replaceAll("(?s)```", "").trim();
    }

    private String callOpenAiPlainText(String prompt) {
        return callOpenAiRaw(prompt).trim();
    }
}
