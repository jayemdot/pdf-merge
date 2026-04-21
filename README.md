# pdf-merge

複数のPDFをブラウザだけで結合できる、シンプルなWebアプリです。

**🔗 今すぐ使う: https://jayemdot.github.io/pdf-merge/**

## 特長

- **サーバーに送信しません** — PDFはブラウザのメモリ上でのみ処理されるため、機密文書でも安心して扱えます
- **ログイン・登録不要** — ページを開いてすぐに使えます
- **並び替え対応** — アップロード後にドラッグ&ドロップでページ順を自由に変更
- **ファイル数無制限** — 2つからいくつでも結合可能（ブラウザのメモリ上限まで）
- **日本語UI**

## 使い方

1. [https://jayemdot.github.io/pdf-merge/](https://jayemdot.github.io/pdf-merge/) を開く
2. PDFをドラッグ&ドロップするか、クリックしてファイルを選択
3. 必要ならドラッグして順番を入れ替える
4. **結合してダウンロード** を押すと `merged-YYYYMMDD-HHmmss.pdf` が保存されます

> **ℹ️ 合計サイズが大きい場合**
> 合計500MBを超えるとブラウザの動作が重くなったり、タブがクラッシュすることがあります（処理はすべてメモリ上で行うため）。大きなファイルを扱う際はPCのスペックに余裕を持たせてください。

## 技術スタック

- [Vite](https://vite.dev/) + [React 19](https://react.dev/) + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com/)
- [pdf-lib](https://pdf-lib.js.org/) — クライアントサイドPDF操作
- [@dnd-kit](https://dndkit.com/) — ドラッグ&ドロップ並び替え
- GitHub Pages + GitHub Actions で自動デプロイ

## ローカル開発

```bash
git clone https://github.com/jayemdot/pdf-merge.git
cd pdf-merge
npm install
npm run dev
```

| コマンド | 説明 |
|---|---|
| `npm run dev` | 開発サーバーを起動（デフォルト: http://localhost:5173/pdf-merge/） |
| `npm run build` | プロダクションビルド（`dist/` に出力） |
| `npm run preview` | ビルド成果物をローカルで確認 |
| `npm run lint` | ESLint を実行 |

## デプロイ

`main` ブランチへの push で [GitHub Actions](https://github.com/jayemdot/pdf-merge/actions) が自動的に GitHub Pages にデプロイします。

## フィードバック

バグ報告や機能提案は [Issues](https://github.com/jayemdot/pdf-merge/issues) までお願いします。
