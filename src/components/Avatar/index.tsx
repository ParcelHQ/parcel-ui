import React from 'react';
import classnames from 'classnames';
import { Badge } from 'reactstrap';

export default function Avatar({
  color,
  className,
  size,
  img,
  badgeUp,
  content,
  icon,
  badgeColor,
  badgeText,
  imgWidth,
  imgHeight,
  status,
}: any) {
  return (
    <div
      className={classnames(
        `avatar ${color ? `bg-${color}` : null}  ${className}`,
        {
          'avatar-sm': size && size === 'sm',
          'avatar-lg': size && size === 'lg',
          'avatar-xl': size && size === 'xl',
        }
      )}
    >
      {img === false || img === undefined ? (
        <span
          className={classnames('avatar-content', {
            'position-relative': badgeUp,
          })}
        >
          {content ? content : null}

          {icon ? <div className="avatar-icon">{icon}</div> : null}
          {badgeUp ? (
            <Badge
              color={badgeColor ? badgeColor : 'primary'}
              className="badge-sm badge-up"
              pill
            >
              {badgeText ? badgeText : '0'}
            </Badge>
          ) : null}
        </span>
      ) : (
        <img
          src={img}
          alt="avatarImg"
          height={imgHeight && !size ? imgHeight : 32}
          width={imgWidth && !size ? imgWidth : 32}
        />
      )}
      {status ? <span className={`avatar-status-${status}`}></span> : null}
    </div>
  );
}
