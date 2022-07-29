
import React from 'react';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import './index.module.less';

export default class ScrollablePanel extends React.Component {
    static propTypes = {
        width: PropTypes.oneOf([PropTypes.number, PropTypes.string]),
        height: PropTypes.oneOf([PropTypes.number, PropTypes.string]),
        style: PropTypes.object,
        className: PropTypes.string,
        children: PropTypes.any
    };
    
    constructor(props) {
        super(props);
        this.updateScroller = this.updateScroller.bind(this);
    }

    updateScroller() {
        this.scrollerRef.updateScroll && this.scrollerRef.updateScroll();
    }

    render() {
        let style = {
            width: this.props.width || '100%',
            height: this.props.height || '100%'
        };
        style = Object.assign(style, this.props.style);
        return (<PerfectScrollbar ref={refs => this.scrollerRef = refs} className={this.props.className} style={style}>
            {this.props.children}
        </PerfectScrollbar>);
    }
}