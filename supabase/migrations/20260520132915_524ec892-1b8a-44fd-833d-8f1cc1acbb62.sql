CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE public.users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nickname text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  is_admin boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.stages (
  id int PRIMARY KEY,
  name text NOT NULL,
  sort_order int NOT NULL
);

CREATE TABLE public.subtopics (
  id int PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  stage_id int NOT NULL REFERENCES public.stages(id) ON DELETE CASCADE,
  name text NOT NULL,
  hint text,
  sort_order int NOT NULL
);

CREATE TABLE public.questions (
  id int PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  subtopic_id int NOT NULL REFERENCES public.subtopics(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('fill_blank','quiz')),
  question_text text NOT NULL,
  correct_answer text NOT NULL,
  options jsonb,
  explanation text
);

CREATE TABLE public.flashcards (
  id int PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  subtopic_id int NOT NULL REFERENCES public.subtopics(id) ON DELETE CASCADE,
  front_text text NOT NULL,
  back_text text NOT NULL
);

CREATE TABLE public.cheatsheets (
  id int PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  subtopic_id int NOT NULL REFERENCES public.subtopics(id) ON DELETE CASCADE,
  title text NOT NULL,
  content_markdown text NOT NULL,
  sort_order int NOT NULL
);

CREATE TABLE public.user_progress (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  question_id int NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  is_correct boolean NOT NULL,
  user_answer text,
  answered_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_user_progress_user ON public.user_progress(user_id);
CREATE INDEX idx_user_progress_question ON public.user_progress(question_id);
CREATE INDEX idx_subtopics_stage ON public.subtopics(stage_id);
CREATE INDEX idx_questions_subtopic ON public.questions(subtopic_id);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subtopics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flashcards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cheatsheets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public read stages" ON public.stages FOR SELECT USING (true);
CREATE POLICY "public read subtopics" ON public.subtopics FOR SELECT USING (true);
CREATE POLICY "public read questions" ON public.questions FOR SELECT USING (true);
CREATE POLICY "public read flashcards" ON public.flashcards FOR SELECT USING (true);
CREATE POLICY "public read cheatsheets" ON public.cheatsheets FOR SELECT USING (true);

INSERT INTO public.stages (id, name, sort_order) VALUES
  (1,'데이터분석',1),(2,'전처리',2),(3,'모델링',3);

INSERT INTO public.subtopics (stage_id, name, hint, sort_order) VALUES
  (1,'라이브러리','pandas, numpy 등 import',1),
  (1,'파일로드','read_csv, read_excel 등',2),
  (1,'데이터 조작','groupby, merge, concat, pivot_table 등',3),
  (1,'단변수 시각화','히스토그램, boxplot 등',4),
  (1,'이변수 시각화','scatter, correlation heatmap 등',5),
  (2,'이상치','IQR, z-score 등',1),
  (2,'결측치','fillna, dropna, KNN imputation',2),
  (2,'원핫 인코딩','pd.get_dummies, OneHotEncoder',3),
  (2,'데이터 분리','train_test_split',4),
  (2,'스케일링','StandardScaler, MinMaxScaler',5),
  (3,'ML학습','분류·회귀 — LogisticRegression, RandomForest 등',1),
  (3,'변수중요도 시각화','feature_importances_',2),
  (3,'성능평가','accuracy, precision, recall, RMSE 등',3),
  (3,'딥러닝','TensorFlow/Keras 기초',4),
  (3,'학습곡선','loss/accuracy curve plotting',5);

INSERT INTO public.users (nickname, password_hash, is_admin) VALUES
  ('admin', crypt('!@#$', gen_salt('bf')), true);

WITH lib AS (SELECT id FROM public.subtopics WHERE name='라이브러리' LIMIT 1)
INSERT INTO public.flashcards (subtopic_id, front_text, back_text)
SELECT id, 'pandas를 import 하는 표준 별칭은?', 'pd → `import pandas as pd`' FROM lib
UNION ALL
SELECT id, 'numpy를 import 하는 표준 별칭은?', 'np → `import numpy as np`' FROM lib;

WITH lib AS (SELECT id FROM public.subtopics WHERE name='라이브러리' LIMIT 1)
INSERT INTO public.questions (subtopic_id, type, question_text, correct_answer, options, explanation)
SELECT id,'fill_blank','데이터프레임을 다루는 라이브러리: `import _____ as pd`','pandas',NULL::jsonb,NULL::text FROM lib
UNION ALL
SELECT id,'fill_blank','수치 계산용 라이브러리: `import _____ as np`','numpy',NULL::jsonb,NULL::text FROM lib
UNION ALL
SELECT id,'quiz','AICE Associate에서 가장 기본이 되는 두 라이브러리는?','pandas, numpy',
  '["pandas, scikit-learn","numpy, matplotlib","pandas, numpy","tensorflow, keras"]'::jsonb,
  '데이터 처리에는 pandas, 수치 연산에는 numpy가 기본입니다.'::text FROM lib
UNION ALL
SELECT id,'quiz','시각화 라이브러리로 가장 많이 쓰이는 조합은?','matplotlib, seaborn',
  '["matplotlib, seaborn","plotly, bokeh","ggplot, lattice","altair, vega"]'::jsonb,
  'matplotlib이 기본, seaborn이 통계 시각화에 편리합니다.'::text FROM lib;

WITH lib AS (SELECT id FROM public.subtopics WHERE name='라이브러리' LIMIT 1)
INSERT INTO public.cheatsheets (subtopic_id, title, content_markdown, sort_order)
SELECT id,'필수 import 문',
E'필수 라이브러리:\n```python\nimport pandas as pd\nimport numpy as np\nimport matplotlib.pyplot as plt\nimport seaborn as sns\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.preprocessing import StandardScaler\n```',
1 FROM lib;

INSERT INTO public.flashcards (subtopic_id, front_text, back_text)
SELECT s.id, '(준비 중) ' || s.name || ' 핵심 개념', '콘텐츠 추가 예정입니다'
FROM public.subtopics s WHERE s.name <> '라이브러리';

INSERT INTO public.questions (subtopic_id, type, question_text, correct_answer, options, explanation)
SELECT s.id, 'quiz', '(준비 중) ' || s.name || ' 샘플 문제', '옵션 A',
  '["옵션 A","옵션 B","옵션 C","옵션 D"]'::jsonb, NULL::text
FROM public.subtopics s WHERE s.name <> '라이브러리';

INSERT INTO public.cheatsheets (subtopic_id, title, content_markdown, sort_order)
SELECT s.id, '(준비 중)', '콘텐츠 추가 예정입니다.', 1
FROM public.subtopics s WHERE s.name <> '라이브러리';