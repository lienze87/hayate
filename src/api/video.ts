import { request } from "@/utils/request";

export function getVideoList() {
  return request.get<any>({
    url: "/upload/mp4",
  });
}

export function getVideoInfo(id: string) {
  return request.get<any>({
    url: `//video/info/${id}`,
  });
}

export function getDataList(params: any) {
  return request.get<any>({
    url: "/frames",
    params,
  });
}

export function getDataDetail(id: string) {
  return request.get<any>({
    url: `/frames/${id}`,
  });
}

export function addData(params: any) {
  return request.post<any>({
    url: "/frames",
    data: params,
  });
}

export function updateData(params: any) {
  return request.put<any>({
    url: `/frames/${params.id}`,
    data: params,
  });
}

export function deleteData(id: string) {
  return request.delete<any>({
    url: `/frames/${id}`,
  });
}

export function addDataImage(params: any) {
  return request.post<any>({
    url: "/images",
    data: params,
  });
}

export function updateDataImage(params: any) {
  return request.put<any>({
    url: `/images/${params.id}`,
    data: params,
  });
}

export function getDataImageDetail(id: string) {
  return request.get<any>({
    url: `/images/${id}`,
  });
}
