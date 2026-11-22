import { buttonClass } from './styles.js';

// variant: primary | secondary | ghost | danger | dangerSolid
// size: md (36px) | sm (32px)
export default function Button({
    variant = 'secondary',
    size = 'md',
    type = 'button',
    className = '',
    ...props
}) {
    return <button type={type} className={buttonClass({ variant, size, className })} {...props} />;
}
