import { Type } from '@sinclair/typebox';
import { generateRegex } from '.';

// param id
export const ParamSchema = Type.Object({
  id: Type.String({
    pattern: '^[a-f0-9]{24}$'
  })
});
// body datatable
enum AjaxOrder {
  Asc = 'ascend',
  Desc = 'descend'
}
export const AjaxSchema = Type.Object({
  Cookie: Type.Optional(Type.String()),
  pageSize: Type.Number({
    default: 10
  }),
  current: Type.Number({
    default: 1
  }),
  searchColumn: Type.Array(Type.String()),
  search: Type.Optional(Type.Object({}, {
    additionalProperties: true
  })),
  field: Type.Optional(Type.String()),
  order: Type.Optional(Type.Enum(AjaxOrder, {
    default: AjaxOrder.Desc
  }))
});
// generate query for mongoose
export const genQuery = ({ pageSize = 10, current = 1, searchColumn, field = 'createdAt', order = 'descend', search }: {
  pageSize: number,
  current: number,
  searchColumn: any,
  search?: any,
  field?: string,
  order?: 'ascend' | 'descend'
}): {
  limit: number,
  skip: number,
  where: {
    [key: string]: any
  },
  sort: {
    [key: string]: 1 | -1
  },
  current: number,
  pageSize: number
} => {
  const where: {
    [key: string]: any
  } = {};
  // Tạo đối tượng search
  if (search) {
    Object.keys(search).forEach((key) => {
      if (key != 'keyword') {
        const value = search[key];
        if (value != null) {
          if (Array.isArray(value)) {
            if (typeof value[0] == 'string' || typeof value[0] == 'number') {
              where[key] = {
                $in: value
              }
            } else if (typeof value[0] == 'boolean') {
              if (value.length == 1) {
                where[key] = {
                  $eq: value[0]
                };
              }
            }
          } else {
            where[key] = value;
          }
        }
      } else {
        const value = search[key];
        if (value) {
          const OR: {
            [key: string]: any
          }[] = [];
          Object.keys(searchColumn).forEach((key) => {
            OR.push({
              [searchColumn[key]]: {
                $regex: generateRegex(value)
              }
            })
          });
          if (OR.length > 0) {
            where.$or = OR;
          }
        }
      }
    });
  }
  return {
    limit: pageSize,
    skip: (current - 1) * pageSize,
    where,
    sort: {
      [field]: order.toLowerCase() == 'ascend' ? 1 : -1
    },
    current,
    pageSize
  }
}
export default genQuery;