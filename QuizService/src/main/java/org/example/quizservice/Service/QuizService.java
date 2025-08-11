package org.example.quizservice.Service;

import org.example.quizservice.Model.QuestionWrapper;
import org.example.quizservice.Model.Quiz;
import org.example.quizservice.Model.Response;
import org.example.quizservice.Repo.QuizRepo;
import org.example.quizservice.feign.QuizInterface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class QuizService {
    @Autowired
    QuizRepo quizrepo;
    @Autowired
    QuizInterface quizInterface;
/*

    @Autowired
    QuestionRepo questionrepo;
*/

    public ResponseEntity<String> createQuiz(String category, int noOfquestions, String title) {
        List<Integer> questions=quizInterface.getQuestionsForQuiz(category,noOfquestions).getBody();
        Quiz quiz=new Quiz();
        quiz.setTitle(title);
        quiz.setQuestionIds(questions);
        quizrepo.save(quiz);

        return new ResponseEntity<>("Quiz created", HttpStatus.CREATED);
    }


    public ResponseEntity<List<QuestionWrapper>> getQuizQuestions(int id) {
        Quiz quiz=quizrepo.findById(id).get();
        List<Integer>questionsids=quiz.getQuestionIds();
        ResponseEntity<List<QuestionWrapper>>questions=quizInterface.getQuestionById(questionsids);
        return questions;
    }

    public ResponseEntity<Integer> calculateresult(int id, List<Response> responses) {
        ResponseEntity<Integer> right=quizInterface.getScore(responses);
        return right;
    }
}
