import { request } from "@/utils/request";

export function getDataList() {
  return request.get<any>({
    url: "/frames",
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
