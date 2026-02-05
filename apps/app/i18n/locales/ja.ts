export default {
    common: {
        language: "言語",
        settings: "設定",
        japanese: "日本語",
        english: "英語",
        back: "戻る",
        error: "エラー",
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
            nausea: "吐き気",
            diarrhea: "下痢",
            tired: "疲労感",
            other: "その他"
        },
        severities: {
            mild: "軽度",
            medium: "中等度",
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
        noData: "現在の履歴に基づく相関データは見つかりませんでした。",
        topCandidates: "トリガー候補",
        allRiskFactors: "全体のリスク要因",
        filteredRiskFactors: "{{type}}のリスク要因",
        axisRisk: "危険度",
        axisFreq: "頻度",
        highRiskZone: "要対策エリア",
        tabRanking: "トリガー順位",
        tabMap: "リスクマップ",
        filterBySymptom: "不調の種類で絞り込み:",
        noDataTitle: "データが不足しています",
        noDataDesc: "パターンを見つけるために食事と症状を記録し続けてください。",
        insight: "あなたのデータは...",
        detectiveTitle: "AI 探偵",
        agentStatus: {
            analyst: "分析エージェントがログをスキャンしています...",
            researcher: "リサーチエージェントがGoogle検索で調査しています...",
            writer: "執筆エージェントがレポートを作成しています...",
        },
        analysisFailed: "分析失敗",
        evidence: "根拠",
        proposal: "提案",
        refresh: "更新",
        discoverPatterns: "隠れたパターンを発見する",
        discoverDescription: "AIエージェントが調査します...",
        startInvestigation: "調査を開始する",
        history: "分析履歴",
        noHistory: "分析履歴はまだありません",
        historyHint: "分析を実行すると表示されます",
        historyFetchFailed: "履歴の取得に失敗しました"
    },
    doctor: {
        reportTitle: "Foody Note レポート",
        reviewSummary: "診断用サマリー",
        stats: {
            symptoms: "記録された症状",
            totalRecorded: "記録総数",
            avgLag: "平均ラグタイム",
            eatingToSymptom: "食事から症状まで"
        },
        correlatedIngredients: "相関のある食材（分析ビュー）",
        referAnalysis: "詳細なトリガーランキングアルゴリズムの結果については、「分析」タブを参照してください。",
        recentEpisodes: "最近のエピソード",
        noEpisodes: "記録されたエピソードはありません。",
        condition: "状態: {{type}} ({{severity}})",
        aiMedicalInsight: "AI医学的見解",
        precedingMeal: "直前の食事",
        defaultHeadline: "分析完了",
        proposal: "改善提案",
        hideDetails: "詳細な考察を隠す",
        showDetails: "詳細な考察を見る",
        detailedAnalysis: "詳細な分析",
        evidence: "根拠"
    },
    meal: {
        takePhoto: "食事の写真を撮る",
        tapToSnap: "タップして撮影",
        selectFromLibrary: "ライブラリから選択",
        dishNameLabel: "料理名",
        dishNamePlaceholder: "料理名を入力（任意）",
        detectedIngredients: "検出された食材",
        detectedCount: "{{count}}個の食材を検出",
        add: "追加",
        analyzeHint: "「食事を分析」をタップして食材を検出します。",
        analyzeBtn: "食事を分析",
        saveBtn: "記録を保存",
        analysisFailedTitle: "分析失敗",
        analysisFailedMsg: "画像を分析できませんでした。もう一度試してください。",
        errorTitle: "エラー"
    },
    symptom: {
        question: "今の気分はどうですか？",
        severityLabel: "重症度",
        notesLabel: "メモ",
        notesPlaceholder: "症状を詳しく書いてください（例：食後の鋭い痛み）",
        saveBtn: "症状を保存"
    },
    login: {
        subtitle: "写真一枚で、あなたの不調の隠れた原因を発見しましょう。",
        startBtn: "同意して開始",
        disclaimer: "続行することで、このアプリが医療機器ではなく、専門的な医療アドバイスの代わりにならないことに同意したものとみなされます。"
    },
    profile: {
        title: "プロフィール設定",
        age: "年齢",
        gender: "性別",
        bowelType: "お腹のタイプ",
        save: "保存",
        options: {
            gender: {
                male: "男性",
                female: "女性",
                other: "その他",
                prefer_not_to_say: "無回答"
            },
            bowel: {
                diarrhea: "下痢しやすい",
                constipation: "便秘しやすい",
                mixed: "混合型（繰り返す）",
                gas: "ガス・おならが溜まりやすい"
            }
        },
        setupTitle: "プロフィール設定",
        setupDescription: "分析精度を上げるため、あなたの基本情報を教えてください。"
    },
    context: {
        modalTitle: "生活コンディション",
        modalDescription: "分析のヒントになります。当てはまるものがあれば選択してください（複数可）",
        factors: {
            stress: "😫 ストレスが多かった",
            sleep: "🛌 睡眠不足気味",
            fast_eating: "💨 早食いしてしまった",
            party: "🍺 飲み会・外食続き",
            medication: "💊 薬を服用中"
        },
        analyzeBtn: "この条件で分析する"
    }
};
