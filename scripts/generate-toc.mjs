import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, basename, dirname, relative } from 'path';

// 허용 카테고리 (정의 순서 = 출력 순서)
const CATEGORIES = [
  'JavaScript', 'TypeScript', 'React', 'CSS', 'HTML',
  'Network', 'Browser', 'CS', '기타',
];

const ROOT = new URL('..', import.meta.url).pathname;
const WEEKS_DIR = join(ROOT, 'weeks');
const README_PATH = join(ROOT, 'README.md');

// ── 파일 수집 ──────────────────────────────────────────────
// weeks/ 하위의 모든 .md 파일을 재귀적으로 수집 (notes.md, README.md 제외)
function collectFiles(dir) {
  const results = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      results.push(...collectFiles(full));
    } else if (
      entry.endsWith('.md') &&
      entry !== 'notes.md' &&
      entry !== 'README.md'
    ) {
      results.push(full);
    }
  }
  return results;
}

// ── 질문 제목 정규화 (중복 판별용) ─────────────────────────
// 소문자화 + 공백/문장부호 전부 제거해서 동일 질문 그룹핑
function normalize(title) {
  return title
    .toLowerCase()
    .replace(/[\s?!.,()'"`\-]/g, '');
}

// ── 질문 파싱 ──────────────────────────────────────────────
// 각 ## 질문에서 카테고리, 답변, 꼬리질문 본문을 통째로 추출
function parseQuestions(filePath) {
  const content = readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  // ## 헤더 위치 찾기
  const h2Indices = [];
  for (let i = 0; i < lines.length; i++) {
    if (/^## /.test(lines[i])) h2Indices.push(i);
  }

  const questions = [];

  for (let qi = 0; qi < h2Indices.length; qi++) {
    const idx = h2Indices[qi];
    const title = lines[idx].replace(/^## /, '').trim();

    // 이 질문의 범위: 현재 ## ~ 다음 ## (또는 파일 끝)
    const endIdx = qi + 1 < h2Indices.length ? h2Indices[qi + 1] : lines.length;
    const section = lines.slice(idx + 1, endIdx);

    // 카테고리 파싱 (첫 줄에서)
    let category = '기타';
    if (section.length > 0) {
      const m = section[0].match(/^-\s+\*\*카테고리\*\*:\s*(.+)$/);
      if (m) category = m[1].trim();
    }

    // 답변 + 꼬리질문 본문 추출 (카테고리 라인 이후 전체)
    // --- 구분자와 빈 줄 트림
    let bodyLines = section.slice(1); // 카테고리 라인 제외

    // 끝에서 --- 구분자와 빈 줄 제거
    while (bodyLines.length > 0) {
      const last = bodyLines[bodyLines.length - 1].trim();
      if (last === '' || last === '---') bodyLines.pop();
      else break;
    }

    // 앞쪽 빈 줄 제거
    while (bodyLines.length > 0 && bodyLines[0].trim() === '') {
      bodyLines.shift();
    }

    const body = bodyLines.join('\n');

    questions.push({ title, category, body });
  }

  return questions;
}

// ── 메인 로직 ──────────────────────────────────────────────
function main() {
  const files = collectFiles(WEEKS_DIR);
  const allQuestions = []; // { title, category, body }

  for (const filePath of files) {
    const parsed = parseQuestions(filePath);
    allQuestions.push(...parsed);
  }

  // ── 카테고리별 그룹핑 ────────────────────────────────────
  const byCategory = new Map();
  for (const cat of CATEGORIES) byCategory.set(cat, []);

  for (const q of allQuestions) {
    const cat = CATEGORIES.includes(q.category) ? q.category : '기타';
    byCategory.get(cat).push(q);
  }

  // ── 중복 묶기 + 정렬 + 토글 생성 ────────────────────────
  const tocLines = [];
  let uniqueCount = 0;

  for (const cat of CATEGORIES) {
    const items = byCategory.get(cat);
    if (items.length === 0) continue;

    // 정규화 키로 그룹핑 (같은 질문은 첫 번째 답변만 사용)
    const groups = new Map();
    for (const q of items) {
      const key = normalize(q.title);
      if (!groups.has(key)) groups.set(key, q);
    }

    // 한글 가나다순 정렬
    const sorted = [...groups.values()].sort((a, b) =>
      a.title.localeCompare(b.title, 'ko')
    );

    tocLines.push(`### ${cat}`);
    tocLines.push('');

    for (const q of sorted) {
      uniqueCount++;
      tocLines.push(`<details>`);
      tocLines.push(`<summary>${q.title}</summary>`);
      tocLines.push('');
      tocLines.push(q.body);
      tocLines.push('');
      tocLines.push(`</details>`);
      tocLines.push('');
    }
  }

  // ── 통계 헤더 ────────────────────────────────────────────
  const now = new Date().toISOString().slice(0, 10);
  const statsHeader = [
    `> **${uniqueCount}** 개 질문 · 마지막 업데이트: ${now}`,
    '',
  ];

  const tocContent = [...statsHeader, ...tocLines].join('\n').trimEnd();

  // ── README 교체 ──────────────────────────────────────────
  const readme = readFileSync(README_PATH, 'utf-8');
  const startMarker = '<!-- TOC:START -->';
  const endMarker = '<!-- TOC:END -->';
  const startIdx = readme.indexOf(startMarker);
  const endIdx = readme.indexOf(endMarker);

  if (startIdx === -1 || endIdx === -1) {
    console.error('오류: README.md에서 TOC 마커를 찾을 수 없습니다.');
    process.exit(1);
  }

  const before = readme.slice(0, startIdx + startMarker.length);
  const after = readme.slice(endIdx);
  const newReadme = `${before}\n${tocContent}\n${after}`;

  writeFileSync(README_PATH, newReadme, 'utf-8');
  console.log(`README.md 갱신 완료! (${uniqueCount}개 질문)`);
}

main();
