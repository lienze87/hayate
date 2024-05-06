import { AxiosResponse } from "axios";

export function downloadFile(response: AxiosResponse, fileName: string) {
  // 获得接口返回的文件名

  let attachmentName = response.headers
    // @ts-ignore
    .get("Content-Disposition")
    ?.split("=")[1];
  if (attachmentName) attachmentName = decodeURIComponent(attachmentName);

  const href = URL.createObjectURL(response.data);

  const link = document.createElement("a");
  link.href = href;
  link.setAttribute("download", attachmentName || fileName);
  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  URL.revokeObjectURL(href);
}
