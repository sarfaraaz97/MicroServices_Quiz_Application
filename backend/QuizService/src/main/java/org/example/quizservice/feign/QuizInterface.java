package org.example.quizservice.feign;

import org.example.quizservice.Model.QuestionWrapper;
import org.example.quizservice.Model.Response;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@FeignClient("QUESTIONSERVICE")
public interface QuizInterface {
    @GetMapping("Question/generate")
    public ResponseEntity<List<Integer>> getQuestionsForQuiz(@RequestParam String categoryname, @RequestParam Integer numofquestions);

    @PostMapping("Question/getQuestions")
    public ResponseEntity<List<QuestionWrapper>> getQuestionById(@RequestBody List<Integer> ids);

    @PostMapping("Question/getscore")
    public ResponseEntity<Integer> getScore(@RequestBody List<Response> responses);

}
