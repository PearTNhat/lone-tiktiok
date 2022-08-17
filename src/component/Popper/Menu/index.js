import classNames from 'classnames/bind';
import styles from './Menu.module.scss';
import Tippy from '@tippyjs/react/headless';
import { useState } from 'react';
//
import { Wrapper as PopperWrapper } from '../../Popper';
import MenuItem from './MenuItems';
import Header from './Language/Header';
const cx = classNames.bind(styles);
function Menu({
    items = [],
    onChange = () => {},
    hideOnClick = false,
    children,
}) {
    const [history, setHistory] = useState([{ data: items }]);
    const currentItems = history[history.length - 1];
    const renderItems = () => {
        return currentItems.data.map((item, index) => {
            // là fuc nên mỗi lần chạy qua 1 item lại tạo ra 1 phạm vi mới
            const isParent = !!item.children;
            return (
                <MenuItem
                    data={item}
                    key={index}
                    onClick={() => {
                        if (isParent) {
                            setHistory((prev) => [...prev, item.children]);
                        } else {
                            onChange(item);
                        }
                    }}
                />
            );
        });
    };
    return (
        <Tippy
            // visible
            hideOnClick={hideOnClick}
            offset={[10, 10]}
            delay={(700, null)}
            interactive
            placement="bottom-start"
            render={(attrs) => (
                <div className={cx('menu-list')} tabIndex="-1" {...attrs}>
                    <PopperWrapper className={cx('menu-wrapper')}>
                        {currentItems.header && (
                            <Header
                                title={currentItems.title}
                                onBack={() => {
                                    setHistory((prev) => {
                                        return prev.slice(0, prev.length - 1);
                                    });
                                }}
                            />
                        )}
                        <div className={cx('language-item')}>
                            {renderItems()}
                        </div>
                    </PopperWrapper>
                    {/* fix bug number language <=4 */}
                    {currentItems.data.length <= 3 && currentItems.header && (
                        <div className={cx('overlay-bottom')}></div>
                    )}
                </div>
            )}
            onHide={() => setHistory(history.slice(0, 1))}
        >
            {children}
        </Tippy>
    );
}

export default Menu;
