package org.example.questionservice.Service;


import org.example.questionservice.Model.Question;
import org.example.questionservice.Model.QuestionWrapper;
import org.example.questionservice.Model.Response;
import org.example.questionservice.Repo.QuestionRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class QuestionService {
    @Autowired
    private QuestionRepo questionrepo;

    public ResponseEntity<List<Question>> getQuestionByCategory(String category) {
        try {
            return new ResponseEntity<>(questionrepo.findByCategory(category), HttpStatus.OK);
        }catch(Exception e)
        {
            e.printStackTrace();
        }
        return new ResponseEntity<>(new ArrayList<>(), HttpStatus.NOT_FOUND);
    }

    public ResponseEntity<List<Question>> getAllQuestions()
    {
        try {
            return new ResponseEntity<>(questionrepo.findAll(), HttpStatus.OK);
        }catch(Exception e)
        {
            e.printStackTrace();
        }
        return new ResponseEntity<>(new ArrayList<>(), HttpStatus.NOT_FOUND);
    }

    public String addQuestion(Question question) {
        questionrepo.save(question);
        return "success";
    }



    public ResponseEntity<List<Integer>> getQuestionsForQUiz(String categoryname,Integer numofquestions) {
        List<Integer> questions=questionrepo.findRandomQuestionsByCategory(categoryname,numofquestions);
        return new ResponseEntity<>(questions, HttpStatus.OK);


    }

    public ResponseEntity<List<QuestionWrapper>> getQuestionsById(List<Integer> ids) {
        List<QuestionWrapper> wrapper=new ArrayList<>();
        List<Question> questions=new ArrayList<>();
        for(int i:ids)
        {
            questions.add(questionrepo.findById(i).get());
        }

        for(Question question:questions)
        {
            QuestionWrapper wrapper1=new QuestionWrapper();
            wrapper1.setId(question.getId());
            wrapper1.setQuestion_title(question.getQuestion_title());
            wrapper1.setOption1(question.getOption1());
            wrapper1.setOption2(question.getOption2());
            wrapper1.setOption3(question.getOption3());
            wrapper1.setOption4(question.getOption4());
            wrapper.add(wrapper1);
        }
        return new ResponseEntity<>(wrapper, HttpStatus.OK);
    }

    public ResponseEntity<Integer> getScore(List<Response> responses) {
        int count = 0;
        for(Response response:responses)
        {
            Question question=questionrepo.findById(response.getId()).get();
            if(response.getResponse().equalsIgnoreCase(question.getRight_answer()))
            {
                count++;
            }
        }
        return new ResponseEntity<>(count, HttpStatus.OK);
    }
}
