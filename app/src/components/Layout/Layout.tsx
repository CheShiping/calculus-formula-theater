import { Outlet } from 'react-router-dom';
import Nav from '../Nav/Nav';

/**
 * 全站统一布局：粘性导航 + 内容出口
 * - 所有页面共用同一个 nav（与原型 01/02/03 一致）
 * - 页面主体由各 Page 组件自己控制宽度/布局
 */
export default function Layout() {
  return (
    <>
      <Nav />
      <Outlet />
    </>
  );
}
