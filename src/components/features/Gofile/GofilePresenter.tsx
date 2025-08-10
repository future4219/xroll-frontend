import React, { useCallback, useState } from "react";
import axios from "axios";
import { Upload } from "lucide-react";
import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";

const UPLOAD_URL = "https://upload.gofile.io/uploadfile";

type Status = "idle" | "uploading" | "success" | "error";

export function GofilePresenter() {
  const [status, setStatus] = useState<Status>("idle");
  const [progress, setProgress] = useState(0);
  const [fileName, setFileName] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  const upload = useCallback(async () => {
    if (!selectedFile) return;
    setStatus("uploading");
    setProgress(0);
    setMessage(null);

    const fd = new FormData();
    fd.append("file", selectedFile);

    try {
      const res = await axios.post(UPLOAD_URL, fd, {
        onUploadProgress: (evt) => {
          if (!evt.total) return;
          setProgress(Math.round((evt.loaded * 100) / evt.total));
        },
        timeout: 0,
      });
      console.log(res.data);
      setProgress(100);
      setStatus("success");
      setMessage("アップロード完了");
    } catch (e) {
      console.error(e);
      setStatus("error");
      setMessage("アップロードに失敗しました");
    }
  }, [selectedFile]);

  const handleSelect = (file: File) => {
    setSelectedFile(file);
    setFileName(file.name);
    setPreviewUrl(URL.createObjectURL(file)); // 事前プレビュー
    setStatus("idle");
    setProgress(0);
    setMessage(null);
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    const files = e.dataTransfer?.files;
    if (!files || files.length === 0) return;
    handleSelect(files[0]);
  }, []);

  const onPick = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    handleSelect(files[0]);
    e.target.value = ""; // 同じファイルを連続選択可能に
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-white text-gray-900">
      <Header />
      <main className="mx-auto w-full max-w-4xl px-4 py-8 pt-24">
        <h1 className="mb-2 text-3xl font-semibold tracking-tight">Upload</h1>
        <p className="mb-6 text-sm text-gray-600">
          Gofile API
          を使って動画/ファイルをアップロードします。ファイルは当社サーバーには保存されません。
        </p>
        <div
          onDrop={onDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          className={`relative overflow-hidden rounded-lg border-2 border-dashed p-10 text-center transition-all ${
            dragOver
              ? "border-blue-400 bg-blue-50"
              : "border-gray-300 bg-gray-50 hover:bg-gray-100"
          }`}
        >
          <Upload className="mx-auto mb-4 h-8 w-8 text-gray-500" />
          <h2 className="text-lg font-semibold">
            {dragOver
              ? "ここにドロップして選択"
              : "ここにファイルをドラッグ＆ドロップ"}
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            または、下のボタンからファイルを選択し、アップロードボタンで送信
          </p>

          <div className="mt-4 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button
              onClick={() => inputRef.current?.click()}
              className="rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
            >
              ファイルを選択
            </button>
            <button
              onClick={upload}
              disabled={!selectedFile}
              className={`rounded px-4 py-2 text-white ${
                selectedFile
                  ? "bg-blue-500 hover:bg-blue-600"
                  : "cursor-not-allowed bg-gray-300"
              }`}
            >
              アップロード
            </button>
            <input
              ref={inputRef}
              type="file"
              accept="video/*,application/octet-stream"
              className="hidden"
              onChange={onPick}
            />
          </div>

          {/* 選択済みファイル名（アップロード前に表示） */}
          {selectedFile && (
            <div className="mt-3 text-sm text-gray-700">
              選択中: <span className="font-medium">{fileName}</span>
            </div>
          )}

          {previewUrl && (
            <div className="mt-6 w-full">
              <video
                src={previewUrl}
                controls
                className="max-h-[60vh] w-full rounded border border-gray-300"
              />
            </div>
          )}

          {status !== "idle" && (
            <div className="relative mt-6 w-full text-left">
              <div className="flex items-center justify-between gap-3">
                <div className="truncate text-sm text-gray-700">{fileName}</div>
                <div className="shrink-0 text-xs text-gray-500">
                  {progress}%
                </div>
              </div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-200">
                <div
                  className={`h-full rounded-full transition-all ${
                    status === "error"
                      ? "bg-red-500"
                      : status === "success"
                      ? "bg-green-500"
                      : "bg-blue-500"
                  }`}
                  style={{ width: `${progress}%` }}
                />
              </div>
              {message && (
                <div
                  className={`mt-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs ${
                    status === "error"
                      ? "bg-red-100 text-red-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {message}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
