package com.universal.springbackend.repository;

import com.universal.springbackend.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    List<Post> findByKeywordsContaining(String keywords);
    List<Post> findByAuthorId(Long authorId);
}
