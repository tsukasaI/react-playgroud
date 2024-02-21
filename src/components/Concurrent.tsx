import React, { useState } from "react";

// Contentの型情報
type Content = {
  title: string;
  description: string;
};

// Contentのサンプル
const dymmyContents: Content[] = [
  { title: "お文具さん", description: "白色の癒やしキャラです" },
  {
    title: "プリンさん",
    description: "お文具さんにおいてツッコミを担当するキャラです",
  },
  { title: "名もなき物さん", description: "黒色の準レギュラーのキャラです" },
  { title: "猫さん", description: "猫っぽい準レギュラーのキャラです" },
  {
    title: "ゼリーさん",
    description: "字幕で喋るタイプの準レギュラーのキャラです",
  },
];

// Contentをランダムに返す
const getDummyContent = (): Content => {
  const index = Math.floor(Math.random() * 5);
  return dymmyContents[index];
};

// axios.postで呼ばれる関数の代理
// 3秒待ってからContentを返す
const createContent = async (): Promise<Content> => {
  await new Promise((resolve) => setTimeout(resolve, 3000));
  return getDummyContent();
};

// コンポーネントの定義
export const ConcurrentSample: React.FC = () => {
  // ContentsをリアクティブにするためにuseStateを使用
  const [contents, setContents] = useState([
    { title: "", description: "" },
    { title: "", description: "" },
    { title: "", description: "" },
    { title: "", description: "" },
  ]);

  // ボタンクリック時にコールされる
  const handleCreateContents = () => {
    // 並行でContentを取得するリクエストを生成
    // Promiseってむずいので一旦読み流しでOKですがわかんなかったら聞いちゃってください
    const promises: Promise<Content>[] = contents.map((_) => createContent());

    // リクエストの結果を戦闘から順に処理
    for (let i = 0; i < promises.length; i++) {
      promises[i].then((res) => {
        // 配列に対して更新処理
        setContents((preContents) =>
          // useStateにおける配列は新しい配列を作成して返さないと更新ができないのでmapで新しい配列を消す
          preContents.map((content, index) => {
            return index === i ? res : content;
          })
        );
      });
    }
  };

  return (
    <div>
      <h1>ConcurrentSample</h1>
      <button onClick={handleCreateContents}>コンテンツを生成する</button>
      {/* ここコンポーネントに分けてみました。普通にHTMLタグ続けちゃってもOK */}
      {contents.map((content, index) => (
        <div key={index}>
          <ContentComponent
            title={content.title}
            description={content.description}
          />
        </div>
      ))}
    </div>
  );
};

const ContentComponent: React.FC<Content> = ({ title, description }) => {
  return (
    <p>
      {title}: {description}
    </p>
  );
};
