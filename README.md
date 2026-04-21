# pdf-merge

複数のPDFをブラウザ内で結合するWebアプリ。すべての処理がブラウザ内で完結するため、ファイルはサーバーに送信されません。

**公開URL**: `https://<username>.github.io/pdf-merge/`

## 機能

- 3つ以上のPDFを結合
- ファイル選択 + ドラッグ&ドロップの両対応
- アップロード後にドラッグで並び替え可能（キーボード操作にも対応）
- 壊れたPDFや非PDFファイルは自動でスキップ＆エラー表示
- フロントエンド完結（PDFはサーバーに送信しない）

## 技術スタック

- Vite + React 19 + TypeScript
- Tailwind CSS v4（`@tailwindcss/vite`）
- [pdf-lib](https://pdf-lib.js.org/) — PDF結合
- [@dnd-kit](https://dndkit.com/) — ドラッグ&ドロップ並び替え

## ローカル開発

```bash
npm install
npm run dev    # 開発サーバー起動
npm run build  # プロダクションビルド
npm run preview # ビルド成果物をローカル確認
```

## GitHub Pages デプロイ

`main` ブランチへの push で GitHub Actions が自動デプロイします。

### 初回セットアップ手順

1. GitHub で `pdf-merge` リポジトリを作成（public 推奨）
2. このプロジェクトを push
   ```bash
   git init
   git add .
   git commit -m "initial commit"
   git branch -M main
   git remote add origin git@github.com:<username>/pdf-merge.git
   git push -u origin main
   ```
3. リポジトリの **Settings → Pages → Source** を **GitHub Actions** に設定
4. Actions タブでワークフローの完了を待つ
5. `https://<username>.github.io/pdf-merge/` で公開を確認

### 別のリポジトリ名で公開する場合

`vite.config.ts` の `base` をリポジトリ名に合わせて書き換えてください。

```ts
export default defineConfig({
  base: '/<your-repo-name>/',
  ...
});
```
