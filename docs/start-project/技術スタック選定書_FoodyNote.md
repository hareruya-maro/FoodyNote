# **技術スタック選定書**

## **プロジェクト：Foody Note (フーディノート)**

### **1\. コアフレームワーク (Core)**

* **Runtime:** **Expo SDK 54** (最新版)  
* **Framework:** **React Native for Web**  
  * Web (PWA) と Native (iOS/Android) を単一コードで出力。  
* **Routing:** **Expo Router v6**  
  * File-based Routing採用。

### **2\. UI / スタイリング (UI & Styling)**

* **Styling Engine:** **NativeWind v5** (Tailwind CSS for React Native)  
* **Icons:** **Lucide React Native**  
* **Fonts:** **Expo Google Fonts** (Noto Sans JP)

### **3\. バックエンド / インフラ (Backend & Infra)**

* **Platform:** **Firebase**  
  * Auth, Firestore, Storage, Hosting  
* **Client SDK:** **Firebase JS SDK**

### **4\. AI / LLM連携 (AI Integration)**

* **Model:** **Google Gemini 1.5 Flash** (または Pro)  
* **Library:** **Google Generative AI SDK**  
  * 画像解析・成分タグ生成に使用。

### **5\. 状態管理・データフェッチ (State & Data)**

* **Server State:** **TanStack Query (React Query)**  
* **Global State:** **Jotai** (軽量な状態管理)

### **6\. その他ユーティリティ**

* **Date:** date-fns  
* **Image Picker:** expo-image-picker