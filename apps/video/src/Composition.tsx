import { AbsoluteFill, OffthreadVideo, Sequence, staticFile } from "remotion";
import { Sidebar } from "./components/Sidebar";

export const MyComposition = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#f5f5f7", flexDirection: "row" }}>
      {/* Left Column: Phone Content */}
      <AbsoluteFill
        style={{ width: "5%", left: 0, backgroundColor: "#f5f5f7" }}
      ></AbsoluteFill>
      <AbsoluteFill
        style={{ width: "27%", left: "5%", backgroundColor: "#f5f5f7" }}
      >
        <div style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <OffthreadVideo
            src={staticFile("demo.mp4")}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              backgroundColor: "#f5f5f7",
            }}
          />
        </div>
      </AbsoluteFill>

      {/* Right Column: Explanatory Text */}
      <AbsoluteFill style={{ width: "68%", left: "32%" }}>
        {/* Scene 1: Intro (0:00 - 0:06) */}
        <Sequence from={0} durationInFrames={180}>
          <Sidebar
            title="Foody Noteへようこそ"
            text={`お腹の不調の原因を、写真で探すアプリ。`}
          />
        </Sequence>

        {/* Scene 2: Profile Input (0:06 - 0:17) */}
        <Sequence from={180} durationInFrames={330}>
          <Sidebar
            title="まずはプロフィールを登録"
            text={`あなたに合わせた分析を行うために、\n基本情報を入力しましょう。`}
          />
        </Sequence>

        {/* Scene 3: Timeline (0:17 - 0:25) */}
        <Sequence from={510} durationInFrames={240}>
          <Sidebar
            title="日々の記録をタイムラインで"
            text={`食事と体調の変化を、\n直感的に振り返ることができます。`}
          />
        </Sequence>

        {/* Scene 4: Meal Selection (0:25 - 0:35) */}
        <Sequence from={750} durationInFrames={300}>
          <Sidebar
            title="AIが食事を自動解析"
            text={`料理の写真を選ぶだけで、AIがメニューや食材を特定。\n面倒な入力は必要ありません。`}
          />
        </Sequence>

        {/* Scene 5: Meal Entry/Date (0:35 - 0:45) */}
        <Sequence from={1050} durationInFrames={300}>
          <Sidebar
            title="詳細な情報も簡単入力"
            text={`料理名の修正や、過去の食事の登録も\nスムーズに行えます。`}
          />
        </Sequence>

        {/* Scene 6: AI Technical (1) (0:45 - 0:51) */}
        <Sequence from={1350} durationInFrames={180}>
          <Sidebar
            title="Geminiによる高度な解析"
            text={`画像からFODMAP（発酵性糖質）など、\nお腹に影響しやすい成分を分析します。`}
          />
        </Sequence>

        {/* Scene 7: AI Technical (2) / Question (0:51 - 1:03) */}
        <Sequence from={1530} durationInFrames={360}>
          <Sidebar
            title="判断に迷う箇所はAIが質問"
            text={`画像から判断しきれない食材などは、\nAIが直接あなたに確認します。`}
          />
        </Sequence>

        {/* Scene 8: Symptom Logging (1:03 - 1:20) */}
        <Sequence from={1890} durationInFrames={510}>
          <Sidebar
            title="体調の変化もワンタップで"
            text={`不調を感じたら、その場ですぐに記録。\n痛みや違和感を、重症度とともに残せます。`}
          />
        </Sequence>

        {/* Scene 9: Transition (1:20 - 1:31) */}
        <Sequence from={2400} durationInFrames={330}>
          <Sidebar
            title="蓄積されたデータを分析"
            text={`記録が溜まると、AIがあなたの不調の\n傾向を読み解きます。`}
          />
        </Sequence>

        {/* Scene 10: Trigger Ranking (1:31 - 1:44) */}
        <Sequence from={2730} durationInFrames={390}>
          <Sidebar
            title="不調のトリガーを特定"
            text={`症状ごとに、疑わしい食材をランキング形式で表示。\n不調の種類に応じた切り替えも可能です。`}
          />
        </Sequence>

        {/* Scene 11: Condition Question (1:44 - 1:54) */}
        <Sequence from={3120} durationInFrames={300}>
          <Sidebar
            title="精度の高い分析のために"
            text={`分析開始時に、最近の睡眠やストレスなどの\nコンディションをAIが詳しく伺います。`}
          />
        </Sequence>

        {/* Scene 12: 3-Step AI Agent (1:54 - 2:12) */}
        <Sequence from={3420} durationInFrames={540}>
          <Sidebar
            title="3段階のAIエージェント"
            text={`分析・Webリサーチ・執筆の3工程を経て、\n専門的かつパーソナライズされたレポートを作成。`}
          />
        </Sequence>

        {/* Scene 13: Analysis Result (2:12 - 2:35) */}
        <Sequence from={3960} durationInFrames={690}>
          <Sidebar
            title="あなたのための、パーソナルレポート"
            text={`分析結果の詳細、具体的なアクションの提案、\nそして深い洞察を提供します。`}
          />
        </Sequence>

        {/* Scene 14: Doctor Mode (2:35 - 3:00) */}
        <Sequence from={4650} durationInFrames={750}>
          <Sidebar
            title="診察を支える高度な解析"
            text={`専門用語を用いた詳細なデータ表示により、\n医師への客観的な説明をサポートします。`}
          />
        </Sequence>

        {/* Scene 15: Lookback (3:00 - 3:10) */}
        <Sequence from={5400} durationInFrames={300}>
          <Sidebar
            title="過去のイベントをスムーズに確認"
            text={`いつ、何が起きたのか。\n食事と不調の相関を、簡単に振り返れます。`}
          />
        </Sequence>

        {/* Scene 16: Outro (3:10 - 3:22) */}
        <Sequence from={5700} durationInFrames={360}>
          <Sidebar
            title="Foody Note"
            text={`あなたのお腹の健康を、AIとともに。\n今すぐダウンロード。`}
          />
        </Sequence>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
