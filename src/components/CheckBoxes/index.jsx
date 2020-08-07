import React from 'react';

export default class Checkbox extends React.Component {
  render() {
    return (
      <div
        className={`vx-checkbox-con ${
          this.props.className ? this.props.className : ''
        } vx-checkbox-primary`}
      >
        <input
          type="checkbox"
          checked={this.props.checked}
          value={this.props.value}
          onClick={this.props.onClick ? this.props.onClick : null}
          onChange={this.props.onChange ? this.props.onChange : null}
        />
        <span className={'vx-checkbox vx-checkbox-sm'}>
          <span className="vx-checkbox--check">{this.props.icon}</span>
        </span>
      </div>
    );
  }
}
