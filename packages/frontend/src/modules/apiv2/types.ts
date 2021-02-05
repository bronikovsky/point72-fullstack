export type PagedQuery<T> = {
  data: T;
  cursor: number;
  total: number;
}
