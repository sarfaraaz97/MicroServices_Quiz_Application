package org.example.quizservice.Model;

import lombok.Data;

@Data
public class QuizDto {
    String category;
    Integer noOfquestions;
    String title;
}
