/**
 * 定义列表项接口
 */
export interface Todo {
  id?: number;
  title?: string;
  completed?: boolean;
}

/**
 * 数量接口
 */
export interface TodosCount {
  active: number;
  completed: number;
  total: number;
}

/**
 * 所有数据接口
 */
export interface Data {
  todos: Todo[];
}
