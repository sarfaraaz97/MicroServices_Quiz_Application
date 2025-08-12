package org.example.questionservice.Controller;
import org.example.questionservice.Model.QuestionWrapper;
import org.example.questionservice.Model.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.example.questionservice.Model.Question;
import org.example.questionservice.Service.QuestionService;
import java.util.List;

@RestController
@RequestMapping("Question")
@CrossOrigin(origins = "http://localhost:3000")
public class QuestionController {

    @Autowired
    private QuestionService questionService;

    @GetMapping("allQuestions")
    public ResponseEntity<List<Question>> getAllQuestions() {

        return questionService.getAllQuestions();
    }
    @GetMapping("category/{category}")
    public ResponseEntity<List<Question>> getQuestionByCategory(@PathVariable String category)
    {
        return questionService.getQuestionByCategory(category);
    }
    @PostMapping("addQuestion")
    public ResponseEntity<String> addQuestion(@RequestBody Question question)
    {
        return new ResponseEntity<>(questionService.addQuestion(question), HttpStatus.CREATED);
    }
    @GetMapping("generate")
    public ResponseEntity<List<Integer>> getQuestionsForQuiz(@RequestParam String categoryname,@RequestParam Integer numofquestions)
    {
        return questionService.getQuestionsForQUiz(categoryname,numofquestions);
    }
    @PostMapping("getQuestions")
    public ResponseEntity<List<QuestionWrapper>> getQuestionById(@RequestBody List<Integer> ids)
    {
        return questionService.getQuestionsById(ids);
    }
    @PostMapping("getscore")
    public ResponseEntity<Integer> getScore(@RequestBody List<Response> responses)
    {
        return questionService.getScore(responses);
    }

}
