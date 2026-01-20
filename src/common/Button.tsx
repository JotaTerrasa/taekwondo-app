export const Button = ({
  children,
  handleClick,
  disabled,
  type,
}: {
  children: React.ReactNode;
  handleClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}) => {
  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      type={type || 'button'}
      className={`w-full h-12 px-4 py-2 font-medium rounded-full transition-colors ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      style={{
        backgroundColor: 'var(--accent-primary)',
        color: 'white',
        border: 'none'
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.backgroundColor = 'var(--accent-hover)';
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          e.currentTarget.style.backgroundColor = 'var(--accent-primary)';
        }
      }}
    >
      {children}
    </button>
  );
};
