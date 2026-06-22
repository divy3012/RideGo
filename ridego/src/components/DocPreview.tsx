function DocPreview({ label, url }: any) {
  const isImage = url?.match(/\.(jpg|jpeg|png|gif|bmp|webp|svg)$/i);
  const isPdf = url?.endsWith(".pdf");
  return (
    <div className="bg-gray-50 rounded-2xl border overflow-hidden shadow-sm">
      <div className="px-4 py-2 text-sm font-semibold border-b">{label}</div>
      <div className="h-52 flex items-center justify-center bg-white">
        {!url && (
          <span className="text-xs text-gray-400">Image Not Uploaded</span>
        )}
        {isImage && <img src={url} className="w-full h-full object-cover" />}
        {isPdf && <iframe src={url} className="w-full h-full" />}
      </div>
      {url && (
        <a
          href={url}
          target="_blank"
          className="block text-center text-xs font-medium py-2 hover:bg-gray-100"
        >
          Open Full Documents
        </a>
      )}
    </div>
  );
}

export default DocPreview;
