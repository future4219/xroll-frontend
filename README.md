# Client

## Installation

1. node.js をインストール`https://nodejs.org/ja`
2. `npm i`を実行
   必要なモジュールが自動でインストールされる

## Deploying

以下のコマンドを実行して、最新のコードを取得し、ビルドして、Nginxの公開ディレクトリに配置する。

# リポジトリの最新化
git pull

# ビルド
NODE_OPTIONS="--max-old-space-size=8192" npm run build

# デプロイ（ビルドしたファイルをNginxの公開ディレクトリにコピー）
sudo cp -r ./dist /var/www/xroll-frontend/

# Nginxを再起動して変更を反映
sudo systemctl restart nginx

## Usages

```sh
.env.exampleが.envという名前でコピーされる
.envがないときに実行
$ cp .env.example .env # create .env

localでアプリが立ち上がる
開発中の画面が見たいときに実行
$ npm run dev  # run for development

ビルド(実際に公開するときの形にファイルを変換)する
$ npm run build  # build with TypeScript and Vite

ビルドされたものを画面上で確認する
$ npm run preview  # preview generated site in local

# lint and test
lintに従っているかチェックする
$ npm run lint

prettierの設定に従って、prettierのフォーマットが走る
lintエラーが出たとき等に実行
$ npm run format
```

## 画面の説明

最初に画面に表示されているのは, `src/components/pages/Sample.tsx`

1. .env で `VITE_API_URL=http://localhost/api` を設定する
2. backend の README に従って, DB を立ち上げる
3. 画面上のテキストボックスに文字を入力して"保存する"ボタンを押すと, API が叩かれてデータベースにその文字が保存される
