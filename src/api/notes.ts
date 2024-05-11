import { request } from "@/utils/request";

export function getDataList() {
  return request.get<any>({
    url: "/notes",
  });
}

export function getDataDetail(id: string) {
  return request.get<any>({
    url: `/notes/${id}`,
  });
}

export function addData(params: any) {
  return request.post<any>({
    url: "/notes",
    data: params,
  });
}

export function updateData(params: any) {
  return request.put<any>({
    url: `/notes/${params.id}`,
    data: params,
  });
}

export function deleteData(id: string) {
  return request.delete<any>({
    url: `/notes/${id}`,
  });
}
