DELETE FROM user_progress;
DELETE FROM cheatsheets;
DELETE FROM flashcards;
DELETE FROM questions;
INSERT INTO cheatsheets (subtopic_id, title, content_markdown, sort_order) VALUES (1, $SEED$[필수 IMPORT 세트]$SEED$, $SEED$시험장에서 가장 먼저 작성하는 셀.
```python
import pandas as pd
import numpy as np
import seaborn as sns
import matplotlib.pyplot as plt
import warnings; warnings.filterwarnings('ignore')
```
**핵심 포인트**
- 별칭(alias)은 문제 지문에 명시된 그대로 사용
- 5개를 첫 셀에 한꺼번에 작성하는 게 표준
- `warnings`는 출력 깔끔하게 하기 위한 보조$SEED$, 1);
INSERT INTO flashcards (subtopic_id, front_text, back_text) VALUES (1, $SEED$pandas의 표준 별칭은?$SEED$, $SEED$pd$SEED$);
INSERT INTO flashcards (subtopic_id, front_text, back_text) VALUES (1, $SEED$matplotlib의 시각화 모듈 별칭은?$SEED$, $SEED$plt (`matplotlib.pyplot as plt`)$SEED$);
INSERT INTO flashcards (subtopic_id, front_text, back_text) VALUES (1, $SEED$seaborn의 표준 별칭은?$SEED$, $SEED$sns$SEED$);
INSERT INTO questions (subtopic_id, type, question_text, correct_answer) VALUES (1, 'fill_blank', $SEED$`import pandas as ___`$SEED$, $SEED$pd$SEED$);
INSERT INTO questions (subtopic_id, type, question_text, correct_answer) VALUES (1, 'fill_blank', $SEED$`import warnings; warnings.___('ignore')`$SEED$, $SEED$filterwarnings$SEED$);
INSERT INTO questions (subtopic_id, type, question_text, options, correct_answer, explanation) VALUES (1, 'quiz', $SEED$AICE 시험 첫 셀의 표준 라이브러리 조합은?$SEED$, $SEED$["pandas, scikit-learn만", "pandas/numpy/seaborn/matplotlib/warnings 5개 세트", "tensorflow와 keras 우선", "pandas만 import"]$SEED$::jsonb, $SEED$pandas/numpy/seaborn/matplotlib/warnings 5개 세트$SEED$, $SEED$이 5개를 첫 셀에 한꺼번에 작성하는 게 시험장 표준$SEED$);
INSERT INTO cheatsheets (subtopic_id, title, content_markdown, sort_order) VALUES (2, $SEED$[CSV 읽기 + 확인]$SEED$, $SEED$```python
data = pd.read_csv('./f.csv')
data.head(4)
data.info()
data.describe()
data.shape
data.columns
```
**핵심 포인트**
- 변수명(`data`, `df` 등)은 **문제 지문 그대로** 사용
- `df` vs `data` 헷갈리면 0점
- `head()` 외에도 `info()`, `describe()`, `shape`, `columns`로 데이터 파악$SEED$, 1);
INSERT INTO flashcards (subtopic_id, front_text, back_text) VALUES (2, $SEED$CSV 파일을 읽는 pandas 함수는?$SEED$, $SEED$pd.read_csv('경로')$SEED$);
INSERT INTO flashcards (subtopic_id, front_text, back_text) VALUES (2, $SEED$데이터 상위 n행을 보는 함수는?$SEED$, $SEED$data.head(n)$SEED$);
INSERT INTO questions (subtopic_id, type, question_text, correct_answer) VALUES (2, 'fill_blank', $SEED$`data = pd._______('./f.csv')`$SEED$, $SEED$read_csv$SEED$);
INSERT INTO questions (subtopic_id, type, question_text, options, correct_answer, explanation) VALUES (2, 'quiz', $SEED$AICE 시험에서 데이터프레임 변수명을 자기 마음대로 짓는 것이 위험한 이유는?$SEED$, $SEED$["성능이 느려져서", "문제 지문에 명시된 변수명과 다르면 채점에서 0점", "오류가 발생해서", "메모리를 많이 써서"]$SEED$::jsonb, $SEED$문제 지문에 명시된 변수명과 다르면 채점에서 0점$SEED$, $SEED$df 대신 data가 명시되어 있다면 반드시 data로 작성. 가장 흔한 실수$SEED$);
INSERT INTO cheatsheets (subtopic_id, title, content_markdown, sort_order) VALUES (3, $SEED$[groupby · merge · concat]$SEED$, $SEED$```python
# 집계
data.groupby('col').mean()
data.groupby(['c1','c2']).agg({'val':'sum'})

# 병합
pd.merge(left, right, on='key', how='inner')  # inner/left/right/outer

# 이어붙이기
pd.concat([df1, df2], axis=0)  # 세로
pd.concat([df1, df2], axis=1)  # 가로

# 기타 자주 쓰임
data.sort_values('col', ascending=False)
data['col'].value_counts()
```
**핵심 포인트**
- `groupby`는 집계 함수(`mean`, `sum`, `count` 등)와 세트
- `merge`의 `how` 옵션 4가지 구분
- `concat`은 axis로 방향 지정$SEED$, 1);
INSERT INTO flashcards (subtopic_id, front_text, back_text) VALUES (3, $SEED$두 데이터프레임을 키 기준으로 합치는 함수는?$SEED$, $SEED$pd.merge(left, right, on='key')$SEED$);
INSERT INTO flashcards (subtopic_id, front_text, back_text) VALUES (3, $SEED$두 데이터프레임을 세로로 이어붙이는 함수는?$SEED$, $SEED$pd.concat([df1, df2], axis=0)$SEED$);
INSERT INTO questions (subtopic_id, type, question_text, correct_answer) VALUES (3, 'fill_blank', $SEED$`data.________('col').mean()` — col 기준 그룹 평균$SEED$, $SEED$groupby$SEED$);
INSERT INTO questions (subtopic_id, type, question_text, options, correct_answer, explanation) VALUES (3, 'quiz', $SEED$pd.merge의 how 옵션 중 양쪽 모두 일치하는 행만 남기는 것은?$SEED$, $SEED$["left", "right", "outer", "inner"]$SEED$::jsonb, $SEED$inner$SEED$, $SEED$inner = 교집합. outer는 합집합, left/right는 한쪽 기준 유지$SEED$);
INSERT INTO cheatsheets (subtopic_id, title, content_markdown, sort_order) VALUES (4, $SEED$[한 변수 분포 보기]$SEED$, $SEED$```python
# 범주형
sns.countplot(data=data, x='col')

# 수치형
sns.histplot(data=data, x='col')
sns.boxplot(data=data, y='col')   # 단변수 박스
```
**핵심 포인트**
- 인자명 `data=`, `x=` 반드시 명시 (생략 시 감점)
- 그래프 해석 문항이 함께 출제되는 경우 多
- 범주형 → countplot, 수치형 분포 → histplot$SEED$, 1);
INSERT INTO flashcards (subtopic_id, front_text, back_text) VALUES (4, $SEED$범주형 변수의 빈도를 시각화하는 seaborn 함수는?$SEED$, $SEED$sns.countplot(data=data, x='col')$SEED$);
INSERT INTO flashcards (subtopic_id, front_text, back_text) VALUES (4, $SEED$수치형 변수의 분포를 보는 시각화 함수 2가지는?$SEED$, $SEED$histplot, boxplot$SEED$);
INSERT INTO questions (subtopic_id, type, question_text, correct_answer) VALUES (4, 'fill_blank', $SEED$`sns._________(data=data, x='col')` — 범주형 빈도 그래프$SEED$, $SEED$countplot$SEED$);
INSERT INTO questions (subtopic_id, type, question_text, options, correct_answer, explanation) VALUES (4, 'quiz', $SEED$AICE 시각화 문제에서 흔한 감점 사유는?$SEED$, $SEED$["색상 선택", "데이터 양이 많아서", "인자명(data=, x=)을 생략", "그래프 크기"]$SEED$::jsonb, $SEED$인자명(data=, x=)을 생략$SEED$, $SEED$data=data, x='col'을 명시적으로 작성해야 안전$SEED$);
INSERT INTO cheatsheets (subtopic_id, title, content_markdown, sort_order) VALUES (5, $SEED$[두 변수 관계 보기]$SEED$, $SEED$```python
# 범주 × 수치
sns.boxplot(x='cat', y='num', data=data)

# 수치 × 수치
sns.jointplot(x='n1', y='n2', data=data)
sns.scatterplot(data=data, x='n1', y='n2')
```
**핵심 포인트**
- **범주 × 수치 → box**
- **수치 × 수치 → joint 또는 scatter**
- jointplot은 산점도 + 두 변수의 분포까지 한 번에$SEED$, 1);
INSERT INTO flashcards (subtopic_id, front_text, back_text) VALUES (5, $SEED$범주형과 수치형 변수의 관계 시각화는?$SEED$, $SEED$sns.boxplot(x='cat', y='num')$SEED$);
INSERT INTO flashcards (subtopic_id, front_text, back_text) VALUES (5, $SEED$두 수치형 변수의 관계 + 분포까지 보는 시각화는?$SEED$, $SEED$sns.jointplot$SEED$);
INSERT INTO questions (subtopic_id, type, question_text, correct_answer) VALUES (5, 'fill_blank', $SEED$`sns._________(x='n1', y='n2', data=data)` — 두 수치 변수 관계 + 분포$SEED$, $SEED$jointplot$SEED$);
INSERT INTO questions (subtopic_id, type, question_text, options, correct_answer, explanation) VALUES (5, 'quiz', $SEED$범주형 x 수치형 변수의 관계를 보기에 가장 적절한 시각화는?$SEED$, $SEED$["jointplot", "boxplot", "histplot", "countplot"]$SEED$::jsonb, $SEED$boxplot$SEED$, $SEED$범주별 수치 분포 비교는 boxplot이 표준$SEED$);
INSERT INTO cheatsheets (subtopic_id, title, content_markdown, sort_order) VALUES (6, $SEED$[IQR 이상치 제거 · 통암기★]$SEED$, $SEED$```python
q1 = data['col'].quantile(0.25)
q3 = data['col'].quantile(0.75)
iqr = q3 - q1
lower = q1 - 1.5 * iqr
upper = q3 + 1.5 * iqr
data_temp = data.drop(data[
    (data['col'] > upper) | (data['col'] < lower)
].index)
```
**핵심 포인트**
- `|` 사이 **괄호 필수** — `(..)|(..)`
- 1.5 배수가 표준 (3 배수는 극단치)
- `data.drop(..., index)` 패턴 통째로 외우기$SEED$, 1);
INSERT INTO flashcards (subtopic_id, front_text, back_text) VALUES (6, $SEED$IQR의 계산식은?$SEED$, $SEED$Q3 - Q1$SEED$);
INSERT INTO flashcards (subtopic_id, front_text, back_text) VALUES (6, $SEED$IQR 이상치 경계의 표준 배수는?$SEED$, $SEED$1.5배$SEED$);
INSERT INTO questions (subtopic_id, type, question_text, correct_answer) VALUES (6, 'fill_blank', $SEED$`upper = q3 + ___ * iqr`$SEED$, $SEED$1.5$SEED$);
INSERT INTO questions (subtopic_id, type, question_text, options, correct_answer, explanation) VALUES (6, 'quiz', $SEED$IQR 기반 이상치 제거 코드의 흔한 오류는?$SEED$, $SEED$["quantile 인자 누락", "`(..)|(..)` 괄호 누락으로 인한 우선순위 오류", "drop 함수 미존재", "iqr 계산식 틀림"]$SEED$::jsonb, $SEED$`(..)|(..)` 괄호 누락으로 인한 우선순위 오류$SEED$, $SEED$조건식 양쪽 괄호가 없으면 비트 연산자 우선순위 때문에 의도와 다른 결과$SEED$);
INSERT INTO cheatsheets (subtopic_id, title, content_markdown, sort_order) VALUES (7, $SEED$[결측치 확인 및 처리]$SEED$, $SEED$```python
# 1) 확인
data.isnull().sum()

# 2) 행 전체 삭제
data_na = data.dropna()

# 3) 대체 (재할당 필수!)
data['col'] = data['col'].fillna(0)
data['col'] = data['col'].fillna(data['col'].mean())
```
**핵심 포인트**
- `fillna(inplace=True)` **금지** (pandas 2.x에서 silent fail)
- 반드시 재할당 패턴 사용
- 평균/중앙값/최빈값 대체 모두 출제$SEED$, 1);
INSERT INTO flashcards (subtopic_id, front_text, back_text) VALUES (7, $SEED$결측치 개수를 확인하는 표준 코드는?$SEED$, $SEED$data.isnull().sum()$SEED$);
INSERT INTO flashcards (subtopic_id, front_text, back_text) VALUES (7, $SEED$결측치를 0으로 채우는 코드는?$SEED$, $SEED$data['col'] = data['col'].fillna(0)$SEED$);
INSERT INTO questions (subtopic_id, type, question_text, correct_answer) VALUES (7, 'fill_blank', $SEED$`data['col'] = data['col']._______(0)`$SEED$, $SEED$fillna$SEED$);
INSERT INTO questions (subtopic_id, type, question_text, options, correct_answer, explanation) VALUES (7, 'quiz', $SEED$pandas 2.x에서 `fillna(0, inplace=True)`가 위험한 이유는?$SEED$, $SEED$["실행 속도가 느려서", "Copy-on-Write 때문에 silent fail 가능", "메모리 누수", "함수가 사라짐"]$SEED$::jsonb, $SEED$Copy-on-Write 때문에 silent fail 가능$SEED$, $SEED$pandas 2.x부터는 재할당 패턴(`x = x.fillna(0)`)이 안전$SEED$);
INSERT INTO cheatsheets (subtopic_id, title, content_markdown, sort_order) VALUES (8, $SEED$[범주형 → 0/1 벡터]$SEED$, $SEED$```python
data_preset = pd.get_dummies(
    data=data_na,
    columns=['col1', 'col2']
)
data_preset.info()  # 컬럼 수 검증
```
**핵심 포인트**
- 반드시 `pd.get_dummies(...)` 사용
- **`df.get_dummies()` 형태 금지** (감점 1순위)
- `columns=[...]` 인자로 명시$SEED$, 1);
INSERT INTO flashcards (subtopic_id, front_text, back_text) VALUES (8, $SEED$범주형 변수를 0/1 벡터로 변환하는 pandas 함수는?$SEED$, $SEED$pd.get_dummies(data=df, columns=[...])$SEED$);
INSERT INTO flashcards (subtopic_id, front_text, back_text) VALUES (8, $SEED$get_dummies의 columns 인자에 들어가는 것은?$SEED$, $SEED$원핫 인코딩 대상 컬럼명 리스트$SEED$);
INSERT INTO questions (subtopic_id, type, question_text, correct_answer) VALUES (8, 'fill_blank', $SEED$`data_preset = pd._____________(data=data_na, columns=['col1','col2'])`$SEED$, $SEED$get_dummies$SEED$);
INSERT INTO questions (subtopic_id, type, question_text, options, correct_answer, explanation) VALUES (8, 'quiz', $SEED$원핫 인코딩 시 가장 흔한 감점 사유는?$SEED$, $SEED$["columns 인자에 리스트 대신 문자열 사용", "`df.get_dummies()` 형태로 작성 (X)", "info() 누락", "결과 변수명 오타"]$SEED$::jsonb, $SEED$`df.get_dummies()` 형태로 작성 (X)$SEED$, $SEED$반드시 `pd.get_dummies(data=df, ...)` 형태. df.get_dummies()는 존재하지 않는 메서드$SEED$);
INSERT INTO cheatsheets (subtopic_id, title, content_markdown, sort_order) VALUES (9, $SEED$[train_test_split · 100% 출제★]$SEED$, $SEED$```python
from sklearn.model_selection import train_test_split

X = data_preset.drop('target', axis=1)
y = data_preset['target']

X_train, X_valid, y_train, y_valid = train_test_split(
    X, y,
    test_size=0.3,
    random_state=7,
    stratify=y
)
```
**핵심 포인트**
- 분리 비율 `test_size=0.3` (또는 0.2)
- `random_state` 반드시 지정 (재현성)
- **`stratify=y`는 분류 문제에만** — 회귀는 생략$SEED$, 1);
INSERT INTO flashcards (subtopic_id, front_text, back_text) VALUES (9, $SEED$train_test_split을 import하는 sklearn 경로는?$SEED$, $SEED$sklearn.model_selection$SEED$);
INSERT INTO flashcards (subtopic_id, front_text, back_text) VALUES (9, $SEED$분류 문제에서 클래스 비율 유지하는 인자는?$SEED$, $SEED$stratify=y$SEED$);
INSERT INTO questions (subtopic_id, type, question_text, correct_answer) VALUES (9, 'fill_blank', $SEED$`from sklearn.model_selection import _________________`$SEED$, $SEED$train_test_split$SEED$);
INSERT INTO questions (subtopic_id, type, question_text, options, correct_answer, explanation) VALUES (9, 'quiz', $SEED$train_test_split의 stratify=y 인자에 대한 설명으로 옳은 것은?$SEED$, $SEED$["회귀 문제에서 필수", "분류 문제에서만 사용 (회귀는 생략)", "항상 None으로 둬야 함", "데이터가 클 때만 사용"]$SEED$::jsonb, $SEED$분류 문제에서만 사용 (회귀는 생략)$SEED$, $SEED$클래스 비율을 유지하기 위한 인자라 회귀에는 의미 없음$SEED$);
INSERT INTO cheatsheets (subtopic_id, title, content_markdown, sort_order) VALUES (10, $SEED$[fit ≠ transform ★]$SEED$, $SEED$```python
from sklearn.preprocessing import StandardScaler
# MinMaxScaler, RobustScaler 도 같은 패턴

ss = StandardScaler()
X_train = ss.fit_transform(X_train)  # train: fit + transform
X_valid = ss.transform(X_valid)       # valid: transform only
```
**핵심 포인트**
- **train에는 `fit_transform`, valid에는 `transform`만**
- `X_valid`에 `fit_transform` 쓰면 **데이터 누수 · 큰 감점**
- Standard/MinMax/Robust 모두 패턴 동일$SEED$, 1);
INSERT INTO flashcards (subtopic_id, front_text, back_text) VALUES (10, $SEED$X_train에 적용하는 스케일러 메서드는?$SEED$, $SEED$fit_transform$SEED$);
INSERT INTO flashcards (subtopic_id, front_text, back_text) VALUES (10, $SEED$X_valid에 적용하는 스케일러 메서드는?$SEED$, $SEED$transform (fit 없음)$SEED$);
INSERT INTO questions (subtopic_id, type, question_text, correct_answer) VALUES (10, 'fill_blank', $SEED$`X_valid = ss.________(X_valid)`$SEED$, $SEED$transform$SEED$);
INSERT INTO questions (subtopic_id, type, question_text, options, correct_answer, explanation) VALUES (10, 'quiz', $SEED$X_valid에 fit_transform을 쓰면 안 되는 이유는?$SEED$, $SEED$["속도가 느려서", "검증 데이터의 통계가 학습에 누수되어 평가가 왜곡됨", "오류가 발생해서", "메모리 부족"]$SEED$::jsonb, $SEED$검증 데이터의 통계가 학습에 누수되어 평가가 왜곡됨$SEED$, $SEED$data leakage. 반드시 train의 통계로만 변환$SEED$);
INSERT INTO cheatsheets (subtopic_id, title, content_markdown, sort_order) VALUES (11, $SEED$[DecisionTree + RandomForest · 분류 vs 회귀]$SEED$, $SEED$**30초 판단법**
- 타겟이 Pass/Fail, 0/1, A/B/C → **분류** (Classifier · accuracy_score · stratify=y)
- 타겟이 가격/시간/거리 등 연속값 → **회귀** (Regressor · mean_absolute_error · stratify 안 함)

```python
# 분류 예
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier

dt = DecisionTreeClassifier(
    max_depth=5,
    min_samples_split=3,
    random_state=7
)
dt.fit(X_train, y_train)
y_pred = dt.predict(X_valid)

# 회귀는 Regressor로 끝만 바꾸면 동일
```
**핵심 포인트**
- 타겟 보고 Classifier/Regressor 선택
- `predict` (not `pred`) — 흔한 오타 감점$SEED$, 1);
INSERT INTO flashcards (subtopic_id, front_text, back_text) VALUES (11, $SEED$타겟이 0/1 이진값이면 어떤 모델?$SEED$, $SEED$Classifier (분류 모델)$SEED$);
INSERT INTO flashcards (subtopic_id, front_text, back_text) VALUES (11, $SEED$DecisionTree의 흔한 하이퍼파라미터 3가지는?$SEED$, $SEED$max_depth, min_samples_split, random_state$SEED$);
INSERT INTO questions (subtopic_id, type, question_text, correct_answer) VALUES (11, 'fill_blank', $SEED$`y_pred = dt._______(X_valid)`$SEED$, $SEED$predict$SEED$);
INSERT INTO questions (subtopic_id, type, question_text, options, correct_answer, explanation) VALUES (11, 'quiz', $SEED$타겟 변수가 '집값(price)'일 때 사용해야 할 모델은?$SEED$, $SEED$["DecisionTreeClassifier", "RandomForestClassifier", "DecisionTreeRegressor", "LogisticClassifier"]$SEED$::jsonb, $SEED$DecisionTreeRegressor$SEED$, $SEED$연속값 예측 → 회귀. 가격/시간/거리는 모두 회귀$SEED$);
INSERT INTO cheatsheets (subtopic_id, title, content_markdown, sort_order) VALUES (12, $SEED$[feature_importances_ · sort_values]$SEED$, $SEED$```python
fi = pd.DataFrame({
    'feature': X.columns,
    'importance': rf.feature_importances_
})
fi = fi.sort_values('importance', ascending=False)[:10]
sns.barplot(data=fi, x='importance', y='feature')
```
**핵심 포인트**
- `feature_importances_` — **끝에 언더스코어** (sklearn 학습된 속성 컨벤션)
- `sort_values` (not `sort_index`)
- 트리 기반 모델(DecisionTree, RandomForest)에서만 가능$SEED$, 1);
INSERT INTO flashcards (subtopic_id, front_text, back_text) VALUES (12, $SEED$RandomForest의 변수 중요도 속성명은?$SEED$, $SEED$rf.feature_importances_ (끝에 _ 주의)$SEED$);
INSERT INTO flashcards (subtopic_id, front_text, back_text) VALUES (12, $SEED$DataFrame을 값으로 정렬하는 메서드는?$SEED$, $SEED$sort_values('col')$SEED$);
INSERT INTO questions (subtopic_id, type, question_text, correct_answer) VALUES (12, 'fill_blank', $SEED$`fi.sort_______('importance', ascending=False)`$SEED$, $SEED$_values$SEED$);
INSERT INTO questions (subtopic_id, type, question_text, options, correct_answer, explanation) VALUES (12, 'quiz', $SEED$변수 중요도 추출에서 흔한 오류는?$SEED$, $SEED$["rf.importances 사용", "sort_index 사용", "feature_importances 끝 언더스코어 누락", "위 모두"]$SEED$::jsonb, $SEED$위 모두$SEED$, $SEED$올바른 형태는 `rf.feature_importances_` + `.sort_values()`$SEED$);
INSERT INTO cheatsheets (subtopic_id, title, content_markdown, sort_order) VALUES (13, $SEED$[accuracy / mean_absolute_error]$SEED$, $SEED$```python
# 분류
from sklearn.metrics import accuracy_score
y_pred = rf.predict(X_valid)
accuracy_score(y_valid, y_pred)

# 회귀
from sklearn.metrics import mean_absolute_error
mean_absolute_error(y_valid, y_pred)
```
**핵심 포인트**
- 분류: `accuracy_score(y_valid, y_pred)` — `_score` 빠뜨리면 감점
- 회귀: `mean_absolute_error` (MAE), `mean_squared_error` (MSE)
- 인자 순서는 (실제값, 예측값)$SEED$, 1);
INSERT INTO flashcards (subtopic_id, front_text, back_text) VALUES (13, $SEED$분류 모델 정확도 함수의 정확한 이름은?$SEED$, $SEED$accuracy_score (not accuracy)$SEED$);
INSERT INTO flashcards (subtopic_id, front_text, back_text) VALUES (13, $SEED$회귀 모델의 MAE 함수는?$SEED$, $SEED$mean_absolute_error$SEED$);
INSERT INTO questions (subtopic_id, type, question_text, correct_answer) VALUES (13, 'fill_blank', $SEED$`accuracy_______(y_valid, y_pred)`$SEED$, $SEED$_score$SEED$);
INSERT INTO questions (subtopic_id, type, question_text, options, correct_answer, explanation) VALUES (13, 'quiz', $SEED$accuracy_score(y_valid, y_pred)의 인자 순서로 올바른 것은?$SEED$, $SEED$["(예측값, 실제값)", "(실제값, 예측값)", "순서 무관", "(model, X)"]$SEED$::jsonb, $SEED$(실제값, 예측값)$SEED$, $SEED$sklearn metrics 표준 — 실제값(y_true) 먼저, 예측값(y_pred) 다음$SEED$);
INSERT INTO cheatsheets (subtopic_id, title, content_markdown, sort_order) VALUES (14, $SEED$[Sequential 뼈대 통암기 ★]$SEED$, $SEED$```python
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout, BatchNormalization
from tensorflow.keras.callbacks import EarlyStopping

model = Sequential([
    Dense(128, activation='relu', input_dim=X_train.shape[1]),
    Dropout(0.3),
    Dense(64, activation='relu'),
    Dense(32, activation='relu'),
    Dense(2, activation='sigmoid')  # 회귀: Dense(1, 'linear')
])

estop = EarlyStopping(
    monitor='val_loss',
    patience=14,
    restore_best_weights=True
)

model.compile(
    optimizer='adam',
    loss='binary_crossentropy',  # 회귀: 'mse'
    metrics=['accuracy']          # 회귀: ['mse']
)

history = model.fit(
    X_train, y_train,
    epochs=50, batch_size=128,
    validation_data=(X_valid, y_valid),
    callbacks=[estop]
)
```
**핵심 포인트**
- **분류 vs 회귀** 차이: 마지막 Dense 활성화 / loss / metrics
- `EarlyStopping` 3개 인자(monitor, patience, restore_best_weights) 필수
- 뼈대 통째로 외우기$SEED$, 1);
INSERT INTO flashcards (subtopic_id, front_text, back_text) VALUES (14, $SEED$Sequential을 import하는 경로는?$SEED$, $SEED$tensorflow.keras.models$SEED$);
INSERT INTO flashcards (subtopic_id, front_text, back_text) VALUES (14, $SEED$분류 문제의 마지막 Dense 활성화는?$SEED$, $SEED$sigmoid (이진) / softmax (다중)$SEED$);
INSERT INTO questions (subtopic_id, type, question_text, correct_answer) VALUES (14, 'fill_blank', $SEED$`from tensorflow.keras.models import __________`$SEED$, $SEED$Sequential$SEED$);
INSERT INTO questions (subtopic_id, type, question_text, options, correct_answer, explanation) VALUES (14, 'quiz', $SEED$회귀 문제로 Sequential 모델 만들 때 마지막 Dense 층은?$SEED$, $SEED$["Dense(2, activation='sigmoid')", "Dense(1, activation='linear')", "Dense(10, activation='softmax')", "Dense(1, activation='relu')"]$SEED$::jsonb, $SEED$Dense(1, activation='linear')$SEED$, $SEED$회귀는 연속값 출력이라 unit 1개 + linear 활성화$SEED$);
INSERT INTO cheatsheets (subtopic_id, title, content_markdown, sort_order) VALUES (15, $SEED$[학습곡선 시각화]$SEED$, $SEED$```python
plt.plot(history.history['accuracy'])
plt.plot(history.history['val_accuracy'])
plt.title('Model Accuracy')
plt.xlabel('Epoch')
plt.ylabel('Accuracy')
plt.legend(['acc', 'val_acc'])
plt.show()
```
**핵심 포인트**
- 분류: `accuracy` / `val_accuracy`
- 회귀: `mse` / `val_mse`
- 지문의 title/범례/축라벨 문자열 **정확히** 맞추기 (대소문자·공백 포함)$SEED$, 1);
INSERT INTO flashcards (subtopic_id, front_text, back_text) VALUES (15, $SEED$history 객체에서 학습 정확도를 꺼내는 키는?$SEED$, $SEED$history.history['accuracy']$SEED$);
INSERT INTO flashcards (subtopic_id, front_text, back_text) VALUES (15, $SEED$검증 정확도 키는?$SEED$, $SEED$history.history['val_accuracy']$SEED$);
INSERT INTO questions (subtopic_id, type, question_text, correct_answer) VALUES (15, 'fill_blank', $SEED$`plt.plot(history.history[___________])` — 검증 정확도$SEED$, $SEED$'val_accuracy'$SEED$);
INSERT INTO questions (subtopic_id, type, question_text, options, correct_answer, explanation) VALUES (15, 'quiz', $SEED$학습곡선 그래프에서 흔한 감점 사유는?$SEED$, $SEED$["선 색깔이 달라서", "title이나 축라벨 문자열이 지문과 다름", "선이 굵어서", "범례 위치"]$SEED$::jsonb, $SEED$title이나 축라벨 문자열이 지문과 다름$SEED$, $SEED$'Model Accuracy', 'Epoch' 등 지문 그대로 매칭해야 채점기가 인정$SEED$);