import { request } from '@/utils/request';

export function checkServer() {
  return request.get<any>({
    url: '/check',
  });
}
