色々分かったこと書くところ
MarkDown 記法：https://tech-camp.in/note/technology/84353/

# Installation

run `npm i`

# Usages

local の開発では、VITE_API_URL=http://localhost/api を設定する

ここらへんのは package.json の scripts で設定してる

```sh
$ cp .env.example .env # create .env

$ npm run dev  # run for development
$ npm run build  # build with TypeScript and Vite
$ npm run preview  # preview generated site in local

# lint and test
$ npm run lint
$ npm run format
$ npm run test
```

# Branch

これは単独開発にはあんま関係ない

- `develop`: 開発用 branch
- `release`: ステージング環境の branch
- `main`: production branch

# ディレクトリ構造

・.vscode
vscode のプロジェクト専用設定ファイル。cSpell.words で指定した単語をスペルチェックから外す。
・dist
npm run build すると勝手に他のフォルダを読み取って作られる。配信用(distribution)。
本番環境で実際にブラウザに表示されるもの。
・src
編集用(source)。プログラムを記述する。
・node_modules
モジュールのインストールコマンド打つと勝手に生える。モジュールを管理。node-modules フォルダの中身や package.json の Dependencies、package-lock.json とかは eslint とかのモジュールインストールコマンド打つと勝手に出てくる。
・public
画像とか CSV とか入れられる。パス参照の時に public は無視される。
例えば、favicon.ico を public/favicon.ico に設置すると、example.com/favicon.ico で配信されるようになる。
従来は static/favicon.ico に設置したファイルは example.com/static/favicon.ico で公開されており、ドメインルートでファイルを配信するのに一手間必要だったが、この一手間が減り、より直感的な仕様になったという利点がある。

# ツールについて

## eslint

静的解析検証ツール。コーディング段階でソースコードの不整合などをチェックすることができるソフトウェア。
コードの綺麗さに厳しい頑固教師。

## prettier

JavaScript、TypeScript、CSS、HTML などのコードフォーマッタでソースコードの自動整形をすることができるソフトウェア。
ファイル保存したら勝手にフォーマットしてくれる。マジ便利。
部屋が散らかってると勝手に片付けしてくれる甘やかしおばあちゃん。

# ルートディレクトリのフォルダ

.env :API 参照先
その他：長いので下に分割

# .prettierrc.json について

prettier の設定ファイル。
参考⇒https://qiita.com/takeshisakuma/items/bbb2cd2f1c65de70e363
参考２⇒https://zenn.dev/rescuenow/articles/c07dd571dfe10f
公式(英語だけど結構分かりやすい)⇒https://prettier.io/docs/en/options.html
使ってるのだけ説明。

・trailingComma
カンマについての設定。以下のオプションがある。デフォルトは none。
"trailingComma": "es5" //ES5 で有効な末尾のカンマ(オブジェクト、配列など)
"trailingComma": "none" //末尾にカンマをつけない(デフォルト)
"trailingComma": "all" //可能な限り末尾にカンマを付ける(関数の引数含む) ※node 8 か transform が必要

・singleQuote"
ダブルクォートの代わりにシングルクォートを使用。JSX quotes はこの項目を無視する。デフォルトは false。
"singleQuote": true //シングルクォートを使う
"singleQuote": false //ダブルクォートを使う(デフォルト)

・tabWidth
インデントに使われるスペースの数を設定。デフォルトは 2。
"tabWidth": 数値

・semi
文の最後にセミコロンを付ける設定。デフォルトは true。
"semi": true //最後にセミコロンを追加(デフォルト)
"semi": false //セミコロンが無いとエラーになる箇所にだけセミコロンを追加

・printWidth
折り返す行の長さを指定。デフォルトは 80。
"printWidth": 数値

・bracketSpacing
オブジェクトリテラルの { } 内にスペースを挿入する設定。デフォルトは true。
"bracketSpacing": true //スペースを入れる(デフォルト)
"bracketSpacing": false //スペースを入れない
true の例：const obj = {foo: "bar"};　 ⇒ 　 const obj = { foo: "bar" };

・bracketSameLine
複数行の要素の最終行の最後に「>」を置く。false は次の行に置く。デフォルトは false。
"bracketSameLine": false (デフォルト)
"bracketSameLine": true
## bracketSameLine-example
true - Example:
<button
  className="prettier-class"
  id="prettier-id"
  onClick={this.handleClick}>
  Click Here
</button>

false - Example:
<button
  className="prettier-class"
  id="prettier-id"
  onClick={this.handleClick}
>
  Click Here
</button>

# package-lock.json について

依存関係の完結結果。インストールコマンドを打つと勝手に出てくる。
package.json にはアプリケーションが依存する npm モジュールを記載できるが、依存モジュールが依存するモジュール(=孫依存モジュール)に関しては何も指定できない。
インストールした孫依存モジュールのバージョンを記録しておき、孫依存モジュールの新しいバージョンが出たとしてもバージョンを固定しておくためには package-lock.json を使う。
package.json だけでは、アプリケーションが依存するすべての npm モジュールのバージョンを固定できないため別の仕組みが必要であり、その仕組みが package-lock.json。
詳細はhttps://note.com/shohey_tech/n/n103120f6295e

# package.json について

長いのがあるので構成要素とかもまとめておく

## 概要
npm init をすると作られる。色々求められるが Enter 押しっぱでもそんなに問題ない。
アプリ開発の際に自分がインストールして使ったライブラリと同じライブラリを、他の開発者の人にも使ってもらうための情報が詰まったファイル。
複数人で共同開発を行う際、ライブラリやバージョンを同じにしなければコードの書き方などが変わる可能性があるため、使用したライブラリやそのバージョンなどが同じ環境で開発を行うことが望ましい。
他の人の開発時には動いていたコードが最新版になると動かなくなる，といったことが起こる可能性がある。
他人が使ったライブラリ全てをバージョンまでそろえて自分の手で探してきて自分の環境に復元する(インストールする)のは時間も手間もかかるのであまり現実的でない。
さらには先述したような依存関係もあるので尚更。
npm install を叩くだけで package.json ファイル内の情報を参照して、使用ライブラリやバージョン、依存関係まで全く同じものを一括でインストールしてくれる。

## 構成要素

### name
モジュールの名前。必須項目。
ソース内で import や require()でモジュール読み込みで利用される。npm モジュールは name と version で一意となることが想定されているので、他のライブラリと名前が重複してはいけない。

### private
このプロパティが true になっていると、モジュールの公開ができない。

### version
モジュールのバージョン。必須項目。
npm モジュールは name と version で一意となることが想定されている。バージョンアップの npm 公開するときは、バージョン番号の更新を忘れないように。

### type
module か commonjs の二択。大抵 module。

#### module
そのパッケージが ECMAScript modules を使用していることを示すフィールド。
ECMAScript modules は、JavaScript の標準的なモジュールシステムであり、モジュールファイル内で export キーワードを使ってエクスポートされた値を、import キーワードで別のモジュールから読み込むことができる。
ただし、module を指定した場合には、CommonJS スタイルのモジュールを読み込むことができなくなるため、一部のライブラリやツールには対応していない場合がある。
module の利点
・ECMAScript モジュールは静的に解決されるため、動的にインポートする必要がない。これにより、開発時の補完、最適化、スコープの安全性が向上。
・CommonJS モジュールでは、トップレベルの this はグローバルオブジェクトを参照するが、ECMAScript モジュールでは undefined を参照する。これにより、トップレベルの this を使ったコードが予期しない動作をするのを防ぐことができる。

#### commonjs
Node.js の環境で動作するアプリケーションやライブラリを開発する場合、CommonJS が標準的なモジュールシステムであるため、互換性が高く、依存関係の解決やビルドの際にトラブルが発生することが少ない。また、Node.js の環境で動作するアプリケーションやライブラリを開発する場合、module を使用する場合と比較して、ファイルの読み込みやビルドの速度が速くなるという利点もある。ただし、Web アプリケーションを開発する場合には module を推奨。

### scripts
任意の shell script を実行するエイリアスコマンド(短縮形のコマンド)を定義できる。
npm run (エイリアスコマンド) で npx (元のコマンド) と同じ動作をできる。
runはscript run の省略形であり、package.jsonのscriptに書かれているエイリアスコマンドを検索して実行してくれる。
npmはカスタムスクリプトに登録されていないコマンドを直接実行することはできないので、エイリアスコマンドを使わない場合はnpxを使う必要がある。
npmとnpxの違い⇒https://qiita.com/sivertigo/items/622550c5d8ec991e59a6
使ってるのを説明。

・"dev": "vite"
Viteが起動され、開発用のローカルサーバーが起動される。ローカル環境でlocalhostで起動。

・"build": "tsc && vite build"
npx tsc とnpx vite buildを同時に行うのと同じ動作を npm run build でできる。
TypeScriptのコンパイルとViteによるアプリケーションのビルドを両方行うためのnpmスクリプト。
tscは、TypeScriptのコンパイラであるtscを実行して、TypeScriptのソースコードをJavaScriptのコードに変換する。
これにより、TypeScriptで書かれたコードをJavaScriptで実行可能なコードに変換できる。
vite buildは、Viteによるアプリケーションのビルドを実行する。
ビルドを実行することで、アプリケーションのコードを最適化し、本番環境でのデプロイに適した形式に変換することができる。
本番環境で起動する。表示されたページはbuild時のコードで固定であり、コードを変更しても反映されない。

・"preview": "vite preview"
Vite ビルドツールを使用してローカルで開発サーバーを起動し、アプリケーションをプレビューすることができる。
ローカル環境でhttpsで起動。

・"lint": "eslint src --ext .js,.jsx,.ts,.tsx"
指定されたディレクトリ（ここではsrc）にあるJavaScript、JSX、TypeScript、およびTSXファイルのコード品質を検査するコマンド。
--extオプションは、対象となるファイルの拡張子を指定する。

・"format": "prettier --write src"
--writeオプションは、Prettierが元のファイルを上書きして修正を適用することを意味する。
したがって、このコマンドは指定されたディレクトリ内のソースコードファイルを自動的に整形し、元のファイルを上書きして修正を適用する。

・"format:check": "prettier --check src"
元のファイルを上書きしない。整形エラーがある場合は、コマンドラインにエラーメッセージが表示される。

・"test": "jest --verbose"
Jestと呼ばれるJavaScriptのテストランナーを起動し、詳細な出力を表示するためのコマンド。

### dependencies,devDependencies
依存するモジュールとバージョンを記述する。
package.json が置かれているディレクトリで npm install すると、dependencies とdevDependenciesに記述されたモジュールが node_module ディレクトリにインストールされる。
インストールされたモジュールの中にも依存しているモジュールがあれば、それもインストールされる。
数珠つなぎのように dependencies に記載された依存関係にあるモジュールがインストールされていく。
テストスクリプトを自動実行するようなものやトランスパイラー(リリースモジュールをビルドするためのモジュール)を dependencies に書いてはいけない。そういうものは devDependencies に記述する。
dependencies は実行時に必要なライブラリ、devDependencies は開発時に必要なライブラリを指定する。
npm install --save-dev モジュール名 でdevDependencies にインストール。
npm install --save モジュール名 でdependenciesにインストール。

## 使ってるモジュール説明(dependencies)

### draft-js系
・draft-js
React製のリッチエディタを作成するためのフレームワーク。
たぶん記事をブラウザ上で書くのとかに使う。
Google ドキュメントのあれこれと考えてもたぶん問題ない。
全体として日本語の分かりやすい記事が少ない。初心者が使うには向いてないかも。
詳細 ⇒https://reffect.co.jp/react/draft-js
公式(英語)⇒https://draftjs.org/
公式(プラグイン/英語)⇒https://www.draft-js-plugins.com/

・@draft-js-plugins/alignment
テキストの整列を制御するプラグイン。左揃え、右揃え、中央揃え、両端揃えなど、様々なテキスト整列オプションを提供する。
以下のプラグイン含めてdraft-js-pluginsは全体的にあまり分かりやすい記事がなかったので、プラグインの詳細は上記公式プラグインドキュメントを参照。

・@draft-js-plugins/anchor
リンク挿入機能を提供するプラグイン。リンクのプレビュー機能も提供する。

・@draft-js-plugins/buttons
テキスト装飾、スタイル付きのボタン、画像や動画などのメディアを挿入するためのカスタマイズ可能なボタンなどを提供。

・@draft-js-plugins/editor
カスタマイズ可能なツールバー、テキストのスタイル変更（太字、イタリック、下線など）、ハイライト、コードブロック、リンク、メンションなどのブロック要素の追加、リッチテキストのシリアライズとデシリアライズなどを提供。

・@draft-js-plugins/image
エディター内に画像を挿入できるようにする機能を提供。

・@draft-js-plugins/static-toolbar
ユーザーが選択したテキストのスタイルを変更するための静的なツールバーを提供する。

・@types/draft-js
TypeScript で Draft.js ライブラリを使用する際に必要な型定義ファイルを提供するパッケージ。

### React系

#### react
UI 用の JavaScript ライブラリ。数ある UI 用ライブラリ・フレームワークの中でもパフォーマンスが高く、最先端の UI を作りやすいのが特徴。hookとかを使えるようになる。API等は公式を参照。
色々使った面白い実装例⇒https://qiita.com/y_kawase/items/8f1b5a303400a09c4923
詳細⇒https://www.kagoya.jp/howto/it-glossary/develop/react/
公式(日本語翻訳中)⇒https://ja.react.dev/
旧版だが公式(完全日本語)⇒https://ja.legacy.reactjs.org/
公式(本家)⇒https://react.dev/

#### react-dom
React コンポーネントをブラウザ上にレンダリングするためのものであり、ReactDOM.render()メソッドなどが提供されている。これにより、React コンポーネントを HTML 要素に変換し、DOM 上に表示することができる。また、React アプリケーションにおいて DOM 上の変更を管理することもできる。React は、コンポーネントのステートやプロパティの変更を検出し、必要に応じて DOM を更新。
API等は公式を参照。
旧版だが日本語公式⇒https://ja.legacy.reactjs.org/docs/react-dom.html
公式(英語)⇒https://ja.react.dev/reference/react-dom
##### (補足)DOM(Document Object Model)
HTML、XML、SVG などの文書をプログラムで扱いやすいオブジェクトの集合として表現するための仕組み。
HTML 文書をブラウザで表示すると、ブラウザがその文書を読み込んで DOM というオブジェクトの階層構造を作る。これによって、JavaScript などのプログラムから HTML の要素や属性を操作したり、追加・削除したりすることができるようになる。
react-draft-wysiwyg:ツールバーとエディタを導入。ウィジウィグ。
詳細 ⇒https://qiita.com/kachuno9/items/c43ef18ed38f97c2aefb

#### react-dropzone
React アプリケーションでファイルのドラッグアンドドロップを実現するためのライブラリ。アップロードされたファイルのプレビューを表示することもできる。
実践 ⇒https://qiita.com/FumioNonaka/items/4ae1ccbfe609e1a10c4d
公式(英語)⇒https://docs.dropzone.dev/
詳細 ⇒https://bluetowel.hatenablog.com/entry/2019/12/14/15161616

#### react-hook-form
React でフォームを簡単に扱うためのライブラリであり、フォームのバリデーションやデータの管理を簡潔かつ柔軟に記述することができる。詳細 ⇒https://qiita.com/hinako_n/items/06f536d2d130712cc76c
公式(一部英語)⇒https://legacy.react-hook-form.com/jp/

#### react-icons
Font Awesome や Material、Codicons（VSCode のアイコン）などのアイコンを簡単に利用することができる React 用のライブラリ。
詳細⇒https://zenn.dev/taichifukumoto/articles/how-to-use-react-icons
公式(英語だが簡単)⇒https://react-icons.github.io/react-icons
github(英語)⇒https://github.com/react-icons/react-icons

#### react-router-dom
SPA の画面状態と URL とを紐づけ、さらにブラウザ履歴の同期を行うことで、疑似的なページ遷移を実現できる。
これにより URL を指定して直接特定の画面にいけたり、ブラウザバックを利用できるようになる。
また、クライアントサイドでのページ遷移となるため、高速に遷移する。
詳細⇒https://qiita.com/h-yoshikawa44/items/aa78b6c7cd1ef43549bf
公式⇒https://reactrouter.com/en/main

#### react-scroll
Reactアプリケーションでスムーズなスクロールエフェクトを実装するためのライブラリ。
ページ内の異なるセクション間を自然なスクロールで移動したりすることができる。
詳細⇒https://fwywd.com/tech/install-react-scroll
github(英語)⇒https://github.com/fisshy/react-scroll

#### react-share
ソーシャルメディアでのコンテンツのシェアを簡単に実装するためのReactコンポーネントライブラリ。
Facebook、Twitter、Pinterestなどのソーシャルメディアプラットフォーム向けに、シェアボタン、アイコン、リンク、カスタムコンポーネントなどが提供されている。
ごく単純だが実装例⇒https://neko-note.org/react-share/628
公式(英語だが簡単)⇒https://www.npmjs.com/package/react-share

#### @hookform/resolvers
react-hook-formの検証を行うためのバリデーションルールを定義するためのライブラリ。
このライブラリを使用することで、react-hook-formのフォーム内で使用されるデータを検証し、エラーメッセージを表示することができる。標準的なバリデーションルールに加えて、カスタムのバリデーションルールを簡単に作成できるようにする機能を提供している。
公式(英語)⇒https://www.npmjs.com/package/@hookform/resolvers

#### @splidejs/react-splide
柔軟性に富み、軽量かつアクセシビリティに優れたスライダーライブラリ。
オプションを変更するだけで、複数枚表示、サムネイル表示、縦方向に移動するスライダーなど、ありとあらゆるスライダーを簡単に作成することができる。
また、APIを使用したり、あるいはExtensionを作成したりすることで、独自の機能を持ったオリジナルのスライダーを構築することも可能。
公式(分かりやすい)⇒https://ja.splidejs.com/


### その他

#### @tailwindcss/line-clamp
tailwindcssの４つある公式プラグイン(Typography,LineClamp,Forms,Aspect Ratio)の１つ。
CSSの line-clamp プロパティを使用して、テキストを指定された行数に制限することができる機能を提供する。
通常、テキストを指定の高さに制限する場合、height プロパティを使用するが、その場合、指定した高さを超えるとテキストが切れてしまうがline-clamp プロパティを使用することで、指定した行数に制限した際に文末を三点リーダで表示できる。
公式(英語)⇒https://www.npmjs.com/package/@tailwindcss/line-clamp
tailwindcssの公式プラグイン概要⇒https://dev.classmethod.jp/articles/tailwind-official-plugins/

#### axios
HTTP通信を簡単に扱えることができるJavaScriptライブラリ。HTTPリクエストを送ったり、JSONを取得したりするのがより簡単になる。
ブラウザを介したXMLHttpRequestsを作成可能
・node.jsでHTTPリクエストを作成可能
・Promise APIをサポート
・リクエスト、レスポンスをキャッチすることができる
・リクエストやレスポンスデータを整形可能
・リクエストのキャンセル
・JSONデータの自動整形
・XSRFに対するクライアントサポート有
などの特徴を持つ。
例⇒https://qiita.com/s_taro/items/30114cfa370aac6c085f
公式⇒https://axios-http.com/ja/docs/intro

#### browser-image-compression
ブラウザ上で画像を圧縮するためのJavaScriptライブラリ。
画像を縮小したり、圧縮率を変更したり、画像フォーマットを変換することができる。
Canvas APIを使用して画像を処理し、Blobオブジェクトとして出力する。
詳細⇒https://bashalog.c-brains.jp/21/03/08-190000.php
公式(英語)⇒https://www.npmjs.com/package/browser-image-compression
##### (補足)Blobとは
Blob（バイナリロングオブジェクト）は、バイナリデータを表し、数値配列、バッファ、文字列を含むデータを表現できる。
ファイルアップロードやWebRTCなど、Webプラットフォームでよく使用される。

#### classnames
Reactが使用しているjsxではclassNameを使ったスタイリングを行うが、動的なクラスの使い分けをする場合や複数のクラス名をつける場合にはclassnamesを用いる。
詳細⇒https://qiita.com/Naoki-Oslo/items/945418056c9b532583c9
公式(英語)⇒https://www.npmjs.com/package/classnames

#### date-fns
JavaScriptのDateオブジェクトと一緒に使用され、日付と時刻のフォーマット、時差、タイムゾーン、ロケール、相対日付、日付の比較、および操作などをサポートする。ブラウザーとNode.jsの両方で使用できる。
例⇒https://qiita.com/dm4/items/fcf5e3b2b650477ce71a
公式(英語)⇒https://date-fns.org/v2.14.0/docs/format

#### date-fns-tz
タイムゾーンの扱いに特化したdate-fnsの拡張版であり、タイムゾーンを扱うための関数を提供する。
具体的には、タイムゾーンを設定した上で日付の加算、減算、フォーマット、言語設定、月の開始/終了日の取得、タイムスタンプの作成など、date-fnsに備わっている機能をタイムゾーンに対応させたものを提供する。
詳細⇒https://qiita.com/suin/items/296740d22624b530f93a
公式(英語)⇒https://www.npmjs.com/package/date-fns-tz

#### js-cookie
JavaScriptでCookieを扱うための軽量なライブラリ。
Webブラウザ上でCookieを作成、読み取り、削除、更新するための簡単なAPIを提供している。
公式⇒https://www.npmjs.com/package/js-cookie
詳細⇒https://webrandum.net/js-cookie/

#### pkce-challenge
OAuth2.0のPKCE (Proof Key for Code Exchange)認証方式で使用されるCode VerifierとCode Challengeの生成を簡単に行うためのJavaScriptライブラリ。
OAuth2.0は、外部サービスからのデータ取得によく用いられる認証プロトコルであり、アプリケーションが代理でユーザーアカウントにアクセスする際に使用される。PKCEはOAuth2.0の認証方式の一つで、悪意のある攻撃者による認証コードの盗み出しを防ぐことができる。
PKCEでは、OAuth2.0で使用される認証コードを生成する前に、ランダムな文字列を生成し、ハッシュ関数にかけて生成されたハッシュ値をCode Challengeとして送信し、認証コードをリクエストするときに、Code Verifierとして使用されるランダムな文字列を生成し、Code Challengeとの相関性を検証する。
pkce-challengeは、このCode VerifierとCode Challengeの生成を簡単に行うためのライブラリであり、ランダムな文字列の生成と、Base64URLエンコード、SHA256ハッシュ化を行う。
OAuth2.0について(すごく分かりやすい)⇒https://qiita.com/TakahikoKawasaki/items/e37caf50776e00e733be
pkceについて⇒https://applis.io/posts/what-is-pkce
公式⇒https://www.npmjs.com/package/pkce-challenge

#### ulid
ulid (Universally Unique Lexicographically Sortable Identifier)とは、UUID(Universally Unique Identifier)のような一意の識別子を生成するためのJavaScriptライブラリ。
UUIDとは異なり、ulidはより短く、URLでの使用に最適化されている。また、生成されたulidは時間順にソートすることができるため、データベースでの使用にも適している。
実装例⇒https://zenn.dev/emiksk/articles/e2716c0af75eea
公式⇒https://github.com/ulid/spec

#### vite
現代の Web プロジェクトのために、より速く無駄のない開発体験を提供することを目的としたビルドツール。
2つの主要な部分で構成されている。
・非常に高速な Hot Module Replacement (HMR) など、ネイティブ ES モジュールを利用した豊富な機能拡張を提供する開発サーバ。
・Rollup でコードをバンドルするビルドコマンド。プロダクション用に高度に最適化された静的アセットを出力するように事前に設定されている。
Vite はすぐに使える実用的なデフォルトが付属していて、プロジェクト生成された構成のままで使えるように設計されていますが、完全な型サポートのある Plugin API と JavaScript API によって高い拡張性もあります。
公式⇒https://ja.vitejs.dev/
どのくらい速いのか⇒https://qiita.com/jay-es/items/b3bc9c1dc077bc3f7f35

#### @vitejs/plugin-react
Vite 公式の React サポートプラグインで、react-refreshによるホットリロード、JSX トランスフォームの対応などの機能を持つ。

#### zod
TypeScript用のスキーマバリデーションライブラリで、簡単にJavaScriptオブジェクトの入力検証を行うことができる。
Zodはオブジェクトの検証だけでなく、文字列、数値、ブーリアン、配列、タプル、マップ、セット、およびネストされたオブジェクトの検証もサポートしている。
詳細⇒https://zenn.dev/kaz_z/articles/how-to-use-zod
公式⇒https://zod.dev/

## 使ってるモジュール説明(devDependencies)

### eslint系

・eslint
eslintを導入。
公式⇒https://eslint.org/

・eslint-config-airbnb
AirbnbのJavascript style guideのLintルールを適用する。
公式⇒https://www.npmjs.com/package/eslint-config-airbnb

・eslint-config-airbnb-typescript
AirbnbのJavascript style guideに従ったTypeScript用のESLint設定を適用する。
公式⇒https://www.npmjs.com/package/eslint-config-airbnb-typescript

・eslint-config-prettier
Prettier と ESLint を共存させるための設定。
Prettier はコードフォーマッターであり、ESLint はコードの構文チェックを行うツールだが、ESLint には一部 Prettier と競合するルールがあるため、eslint-config-prettier を設定することで、ESLint のルールと Prettier のルールが競合する場合に、Prettier のルールが優先されるように設定できる。
公式⇒https://github.com/prettier/eslint-config-prettier

・eslint-import-resolver-typescript
TypeScript のプロジェクトで ESLint の import 文を解決するための設定。
TypeScript は、JavaScript に静的型チェックを加えた言語であり、import 文によって他のモジュールを参照する際にそのモジュールの型情報も必要になるため、ESLint を使って静的型チェックを行うことができるようになる。
公式⇒https://www.npmjs.com/package/eslint-import-resolver-typescript

・eslint-plugin-import
ESLintのプラグインの1つで、importステートメントを検証するためのルールを適用する。
このプラグインを使用すると、例えば、存在しないファイルのインポート、相対パスでのインポートの使用、node_modulesディレクトリ外からの相対パスでのインポートなど、モジュールのインポートに関する様々な問題を検出できる。
公式⇒https://www.npmjs.com/package/eslint-plugin-import

・eslint-plugin-jsx-a11y
Reactコンポーネント内のアクセシビリティの問題を自動的に検出するためのESLintプラグイン。
WCAG2.0の指針に基づいたReactアプリケーションのアクセシビリティに関する推奨事項を適用する。
例:画像にalt属性を設定する、タブキーでフォーカス可能な要素を提供する、レスポンシブなデザインでスタイルが壊れないようにするetc.
WCAG2.0:インターネットに関する技術開発と標準化を行っている国際的団体であるWorld Wide Web Consortium が、Webアクセシビリティを確立することを目的として、WCAG1.0の改定版として公表した12項目のガイドラインと達成基準等で構成されるドキュメント。
公式⇒https://www.npmjs.com/package/eslint-plugin-jsx-a11y

・eslint-plugin-react
Reactプロジェクトでの静的コード解析を行い、問題を検出するためのESLintプラグイン。
例:コンポーネントのPropsの型が適切でない場合や、不適切なDOMイベントが使用された場合etc.
公式⇒https://www.npmjs.com/package/eslint-plugin-react

・eslint-plugin-react-hooks
Reactフックを使用する場合のベストプラクティスを確認し、問題を報告するためのESLintプラグイン。
例:フックが条件文の中で使用された場合や、同じフックが複数回呼び出された場合など。
公式⇒https://www.npmjs.com/package/eslint-plugin-react-hooks

### その他

・jest
Facebookによって開発されたJavaScriptのテスティングフレームワーク。
Reactアプリケーションのテストに特化した機能を提供しており、Reactコンポーネントのテスト、APIのテスト、Snapshotテストなどを簡単に行うことができる。Jestは、ビルトインのアサーション、モック、スパイ、テストランナー、コードカバレッジなどの機能を提供している。
npmパッケージとして提供されており、Node.js上で動作するため、JavaScriptで書かれたプロジェクトで広く使用されている。
実装例⇒https://weseek.co.jp/tech/2469/
公式⇒https://jestjs.io/ja/docs/getting-started

・@testing-library/jest-dom
JestのテストコードでDOMのテストを行う際に、DOMに対するより豊富なアサーションを提供するライブラリ。
公式⇒https://www.npmjs.com/package/@testing-library/jest-dom

・@testing-library/react




# .eslintrc.cjs について

これも長いのがあるので構成要素とかもまとめておく。
eslint の設定ファイル。

## env

プログラムが実行される環境を指定する。true で適用する。
オプションは色々あるけど大抵 browser と es の適正バージョンと node で ok。jQuery とかもあるっぽい。
オプション一覧 ⇒https://eslint.org/docs/user-guide/configuring/language-options#specifying-environments
ESLint はブラウザ上で動くものではないため alert とかを変数定義もなしに呼び出すと警告されるが、
.eslintrc に globals という設定を入れておくことにより、これらはグローバルに定義されている変数だからいきなり使ってよいという設定をすることができる。
ただブラウザにはたくさんのグローバル変数があり、それらを使うたびに globals 設定を追加していくのは大変。
そこで env 設定に browser をいれることにより window や alert も含まれるたくさんのブラウザ用のグローバル変数を一気に globals 設定に登録してしまい、ESLint にチェックしなくてよいと
伝えることができる。
参考：https://zenn.dev/kimromi/articles/546923b7281dcb

## extends

導入する拡張機能。
各構成オブジェクトには多数のルールが含まれているが、一部のルールは他の構成オブジェクトと競合することがある。
その場合は、最後に指定された構成オブジェクトが優先される。
使っている拡張機能のみを説明。
eslint:recommended : ESLint が提供する推奨されるルールセット。
plugin:react/recommended : React プラグインによって提供される React に関する推奨されるルール。
plugin:@typescript-eslint/recommended :TypeScript ESLint プラグインによって提供される TypeScript の推奨されるルール。
plugin:import/recommended :import/export 文に関するルールを提供する import プラグインによる推奨されるルール。
plugin:import/typescript :TypeScript での import/export 文に対する import プラグインの推奨されるルール。
airbnb : Airbnb JavaScript スタイルガイド(クリーンで一貫性のあるコードを書くためのガイドライン)に従うようにルールを設定。
airbnb-typescript :Airbnb TypeScript スタイルガイドに従うようにルールを設定。
prettier : Prettier スタイルガイドに従うようにルールを設定。

## overrides

異なるファイルパス、ファイル名、または glob パターンに基づいて、特定のファイルまたは
ファイルセットに対して別の設定を適用するために使用される。
特定のファイルに対してカスタム設定をオーバーライドすることで、プロジェクト全体に一貫性のある
コーディングスタイルを適用しながら、個々のファイルに対して特定のルールを適用することができる。
例：src/**tests**/_.test.js という glob パターンに対して別の設定を適用する場合
"overrides": [
    {
      "files": ["src/__tests__/*.test.js"],
      "rules": {
        "no-console": "off"
      }
    }
  ]
"no-console"ルールを無効にする特定のファイルに対してのみ設定がオーバーライドされる。

## parser
