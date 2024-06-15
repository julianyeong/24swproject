package com.universal.springbackend.controller;

import com.universal.springbackend.dto.PostDTO;
import com.universal.springbackend.entity.Post;
import com.universal.springbackend.entity.User;
import com.universal.springbackend.service.PostService;
import jakarta.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@RestController
@SessionAttributes("loginUser")
@RequestMapping("/api/posts")
public class PostController {

    @Autowired
    private PostService postService;

    // 전체 게시물 조회
    @GetMapping("/")
    public ResponseEntity<List<PostDTO>> getAllPosts() {
        log.info("getAllPosts().executed");
        List<Post> postList = postService.getAllPosts();
        List<PostDTO> postDTOList = postList.stream().map(this::convertToDTO).collect(Collectors.toList());
        return ResponseEntity.ok(postDTOList);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<PostDTO>> getPostsByUserId(@PathVariable Long userId) {
        List<Post> posts = postService.findByUserId(userId);
        List<PostDTO> postDTOList = posts.stream().map(this::convertToDTO).collect(Collectors.toList());
        return new ResponseEntity<>(postDTOList, HttpStatus.OK);
    }

    // 자신의 게시물 조회
    @GetMapping("/user")
    public ResponseEntity<List<PostDTO>> getMyPosts(HttpSession session) {
        User loginUser = (User) session.getAttribute("loginUser");
        if (loginUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        List<Post> postList = postService.findByUserId(loginUser.getId());
        List<PostDTO> postDTOList = postList.stream().map(this::convertToDTO).collect(Collectors.toList());
        return ResponseEntity.ok(postDTOList);
    }

    // 게시물 작성
    @PostMapping("/")
    public ResponseEntity<PostDTO> createPost(@RequestParam(value = "image", required = false) MultipartFile image,
                                              @RequestParam("title") String title,
                                              @RequestParam("caption") String caption,
                                              @RequestParam("keywords") String keywords,
                                              HttpSession session) {
        log.info(">>>>> PostController.createPost.executed()");
        User loginUser = (User) session.getAttribute("loginUser");
        if (loginUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        try {
            Post post = new Post();
            post.setTitle(title);
            post.setCaption(caption);
            post.setKeywords(keywords);
            post.setAuthor(loginUser);
            post.setCreatedDate(new Date());

            if (image != null && !image.isEmpty()) {
                log.info("Uploading image: " + image.getOriginalFilename());
                String originalFilename = image.getOriginalFilename();
                String uploadDir = "/Users/ewjin/Downloads/photodiary-FE/public/img";
                String imagePath = uploadDir + "/" + originalFilename;

                try {
                    byte[] bytes = image.getBytes();
                    Path path = Paths.get(imagePath);
                    Files.write(path, bytes);
                    String webPath = "/img/" + originalFilename;
                    post.setImage(webPath);
                    post.setOriginal(originalFilename);
                } catch (IOException e) {
                    e.printStackTrace();
                }
            } else {
                log.info("No image uploaded");
                post.setImage(null);
            }
            Post savedPost = postService.save(post);
            PostDTO postDTO = convertToDTO(savedPost);
            return new ResponseEntity<>(postDTO, HttpStatus.CREATED);
        } catch (Exception e) {
            log.error("Error creating post", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // 게시물 수정
    @PutMapping("/{id}")
    public ResponseEntity<PostDTO> updatePost(@PathVariable Long id, @RequestParam(value = "image", required = false) MultipartFile image,
                                              @RequestParam("title") String title,
                                              @RequestParam("caption") String caption,
                                              @RequestParam("keywords") String keywords,
                                              HttpSession session) {
        log.info(">>>>> PostController.updatePost.executed()");
        User loginUser = (User) session.getAttribute("loginUser");
        if (loginUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        Post existingPost = postService.getPostById(id);
        if (existingPost == null) {
            return ResponseEntity.notFound().build();
        }
        if (!existingPost.getAuthor().getId().equals(loginUser.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        if (title.isEmpty() || caption.isEmpty() || keywords.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        existingPost.setTitle(title);
        existingPost.setCaption(caption);
        existingPost.setKeywords(keywords);

        Post savedPost = postService.save(existingPost);
        PostDTO postDTO = convertToDTO(savedPost);

        return ResponseEntity.ok(postDTO);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable Long id, HttpSession session) {
        log.info(">>>>> PostController.deletePost.executed()");
        User loginUser = (User) session.getAttribute("loginUser");
        if (loginUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        Post existingPost = postService.getPostById(id);
        if (existingPost == null) {
            return ResponseEntity.notFound().build();
        }
        if (!existingPost.getAuthor().getId().equals(loginUser.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        try {
            postService.delete(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            log.error("Error deleting post", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/search")
    public ResponseEntity<List<PostDTO>> searchPostsByTitle(@RequestParam String keywords) {
        log.info(">>>>> PostController.searchPostsByTitle.executed()");
        List<Post> foundPosts = postService.searchByCaption(keywords);
        if (!foundPosts.isEmpty()) {
            List<PostDTO> postDTOList = foundPosts.stream().map(this::convertToDTO).collect(Collectors.toList());
            return ResponseEntity.ok(postDTOList);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    private PostDTO convertToDTO(Post post) {
        PostDTO postDTO = new PostDTO();
        postDTO.setId(post.getId());
        postDTO.setTitle(post.getTitle());
        postDTO.setCaption(post.getCaption());
        postDTO.setKeywords(post.getKeywords());
        postDTO.setCreatedDate(post.getCreatedDate());
        postDTO.setOriginal(post.getOriginal());

        if (post.getAuthor() != null) {
            postDTO.setAuthorId(post.getAuthor().getId());
        } else {
            postDTO.setAuthorId(null);
        }

        if (post.getImage() != null) {
            postDTO.setImage(post.getImage());
        } else {
            postDTO.setImage("");
        }

        return postDTO;
    }
}