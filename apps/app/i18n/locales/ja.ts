export default {
    common: {
        language: "言語",
        settings: "設定",
        japanese: "日本語",
        english: "英語",
    },
    settings: {
        title: "設定",
        doctorMode: {
            title: "医師向けプレゼンテーションモード",
            description: "診察のために確認項目を表示します。"
        },
        preferences: "設定",
        account: "アカウント",
        profile: "プロフィール",
        signOut: "ログアウト",
    },
    tabs: {
        home: "ホーム",
        calendar: "カレンダー",
        analysis: "分析",
        settings: "設定"
    },
    home: {
        noRecords: "記録はまだありません。",
        addFirst: "最初の食事や症状を記録しましょう！",
        buttons: {
            symptom: "症状",
            meal: "食事"
        }
    },
    symptoms: {
        types: {
            pain: "痛み",
            bloated: "膨満感",
            nausea: "吐き気"
        },
        severities: {
            mild: "軽度",
            moderate: "中等度",
            severe: "重度"
        }
    },
    calendar: {
        history: "履歴",
        mock: {
            title: "カレンダービュー（モック）",
            description: "症状があった日は赤く表示されます",
            lunch: "昼食",
            meal: "パスタ（カルボナーラ）",
            symptom: "症状",
            symptomDetail: "胃痛（中等度）"
        }
    },
    analysis: {
        title: "分析",
        triggerFound: "トリガーの可能性あり",
        noData: {
            title: "データが不足しています",
            description: "パターンを見つけるために食事と症状を記録し続けてください。"
        },
        topCandidates: "トリガー候補",
        associatedEpisodes: "{{count}}件のエピソードに関連",
        freq: "頻度",
        noPatterns: "まだパターンは検出されていません。",
        insight: "あなたのデータは「{{name}}」が症状の前に頻繁に現れることを示唆しています。エピソード前の{{count}}回の食事で発見されました。"
    }
};
