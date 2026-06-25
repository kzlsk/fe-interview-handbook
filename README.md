<div align="center">

# 📝 Frontend Interview Handbook

**신입/주니어 프론트엔드 개발자를 위한 기술면접 대비 스터디**

매주 질문을 작성하고, 서로 꼬리질문하며 성장하는 스터디입니다.

</div>

---

## 👨‍👩‍👦‍👦 Contributer

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/hov-i">
        <img src="https://github.com/hov-i.png" width="120px" /><br />
        <sub><b>hovi</b></sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/kzlsk">
        <img src="https://github.com/kzlsk.png" width="120px" /><br />
        <sub><b>kzlsk</b></sub>
      </a>
    </td>
  </tr>
</table>

---

## 📌 진행 방식

1. 매주 `weeks/week-XX/{본인 핸들}.md` 파일을 만들어 PR을 올립니다.
2. 한 파일에 최소 **10개** 질문 + 답변 + 꼬리질문을 작성합니다.
3. 스터디 시간에 서로 질문하고 리뷰 후 PR을 머지합니다.
4. 머지되면 GitHub Actions가 자동으로 아래 질문 인덱스를 갱신합니다.

> 작성 규칙은 [CONTRIBUTING.md](CONTRIBUTING.md)를 참고하세요.

## 📚 Interview

<!-- TOC:START -->
> **5** 개 질문 · 마지막 업데이트: 2026-06-25

### JavaScript

<details>
<summary>이벤트 루프가 어떻게 동작하나요?</summary>

### 답변
이벤트 루프는 콜 스택, 태스크 큐(매크로태스크 큐), 마이크로태스크 큐로 구성됩니다.

1. 콜 스택이 비면 마이크로태스크 큐를 먼저 확인합니다.
2. 마이크로태스크 큐가 비면 매크로태스크 큐에서 하나를 꺼내 실행합니다.
3. 이 과정을 반복합니다.

`Promise.then`은 마이크로태스크, `setTimeout`은 매크로태스크에 등록됩니다.

### 꼬리질문
- 마이크로태스크와 매크로태스크의 차이는?
- requestAnimationFrame은 어디에 속하나요?

</details>

<details>
<summary>클로저란 무엇인가요?</summary>

### 답변
클로저는 함수가 선언된 렉시컬 환경을 기억하여, 함수가 해당 스코프 밖에서 실행되더라도 그 환경에 접근할 수 있는 기능입니다.

```javascript
function outer() {
  let count = 0;
  return function inner() {
    return ++count;
  };
}

const counter = outer();
counter(); // 1
counter(); // 2
```

외부 함수의 변수 `count`가 내부 함수 `inner`의 클로저에 의해 유지됩니다.

### 꼬리질문
- 클로저가 메모리 누수를 일으킬 수 있나요?
- 클로저를 활용한 모듈 패턴은 어떻게 구현하나요?

</details>

### React

<details>
<summary>Virtual DOM이란 무엇인가요?</summary>

### 답변
Virtual DOM은 실제 DOM의 가벼운 복사본을 메모리에 유지하는 개념입니다.
상태가 변경되면 새로운 Virtual DOM 트리를 생성하고, 이전 트리와 비교(diffing)하여
변경된 부분만 실제 DOM에 반영(reconciliation)합니다.

이를 통해 불필요한 DOM 조작을 줄여 성능을 최적화합니다.

### 꼬리질문
- React Fiber는 무엇인가요?
- key prop이 reconciliation에서 왜 중요한가요?

</details>

### CSS

<details>
<summary>CSS에서 BEM 방법론이란 무엇인가요?</summary>

### 답변
BEM은 Block, Element, Modifier의 약자로, CSS 클래스 네이밍 규칙입니다.

- **Block**: 독립적인 컴포넌트 (`.card`)
- **Element**: Block의 구성 요소 (`.card__title`)
- **Modifier**: 상태나 변형 (`.card--highlighted`)

코드의 재사용성과 가독성을 높여주는 방법론입니다.

### 꼬리질문
- BEM 외에 다른 CSS 네이밍 방법론은?
- CSS Modules과 BEM을 함께 사용할 수 있나요?

</details>

### Network

<details>
<summary>HTTP와 HTTPS의 차이점은 무엇인가요?</summary>

### 답변
HTTPS는 HTTP에 TLS/SSL 암호화 계층을 추가한 프로토콜입니다.

| 구분 | HTTP | HTTPS |
|------|------|-------|
| 포트 | 80 | 443 |
| 암호화 | 없음 | TLS/SSL |
| 인증서 | 불필요 | 필요 |

HTTPS는 데이터를 암호화하여 중간자 공격을 방지하고, 데이터 무결성을 보장합니다.

### 꼬리질문
- TLS 핸드셰이크 과정을 설명해주세요.
- HSTS란 무엇인가요?

</details>
<!-- TOC:END -->
