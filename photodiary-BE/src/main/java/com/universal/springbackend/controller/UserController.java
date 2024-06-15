package com.universal.springbackend.controller;

import com.universal.springbackend.entity.User;
import com.universal.springbackend.service.UserService;
import jakarta.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@Slf4j
@RestController
@SessionAttributes("loginUser")
@RequestMapping("/api/users")
public class UserController {

	@Autowired
	private UserService userService;

	// 회원가입
	@PostMapping
	public ResponseEntity<User> createUser(@RequestBody User user) {
		if (userService.usernameExists(user.getUsername())) {
			return new ResponseEntity<>(null, HttpStatus.CONFLICT);
		}
		User savedUser = userService.save(user);
		return new ResponseEntity<>(savedUser, HttpStatus.CREATED);
	}

	// 아이디 중복검사
	@GetMapping("/check")
	public ResponseEntity<Boolean> checkUserLoggedIn(HttpSession session) {
		User loginUser = (User) session.getAttribute("loginUser");
		if (loginUser == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(false);
		} else {
			return ResponseEntity.ok(true);
		}
	}


	// 로그인
	@PostMapping("/login")
	public ResponseEntity<User> loginUser(@RequestParam String username,
	                                      @RequestParam String password,
	                                      HttpSession session, Model model) {
		User loginUser = userService.findOne(username, password);
		if (loginUser != null) {
			session.setAttribute("loginUser", loginUser);
			model.addAttribute("loginUser", loginUser); // 세션 속성 설정
			return new ResponseEntity<>(loginUser, HttpStatus.OK);
		} else {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}
	}

	// 로그아웃
	@PostMapping("/logout")
	public ResponseEntity<Void> logout(HttpSession session) {
		session.removeAttribute("loginUser");
		return ResponseEntity.status(HttpStatus.OK).build();
	}

	// 전체 회원목록
	@GetMapping("/")
	public ResponseEntity<List<User>> getAllUsers() {
		List<User> userList = userService.findAll();
		if (!userList.isEmpty()) {
			return new ResponseEntity<>(userList, HttpStatus.OK);
		} else {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
		}
	}

	@GetMapping("/{userId}")
	public ResponseEntity<User> getUserById(@PathVariable Long userId) {
		Optional<User> userOptional = userService.findById(userId);
		return userOptional.map(user -> ResponseEntity.ok().body(user))
				.orElse(ResponseEntity.notFound().build());
	}

	// 현재 로그인한 사용자 정보 가져오기
	@GetMapping("/me")
	public ResponseEntity<User> getCurrentUser(HttpSession session) {
		User loginUser = (User) session.getAttribute("loginUser");
		if (loginUser == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}
		return ResponseEntity.ok(loginUser);
	}
}