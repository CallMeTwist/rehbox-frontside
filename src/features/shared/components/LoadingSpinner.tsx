const LoadingSpinner = ({ size = "md" }: { size?: "sm" | "md" | "lg" }) => {
  const sizeClass = size === "sm" ? "w-5 h-5" : size === "lg" ? "w-12 h-12" : "w-8 h-8";
  return (
    <div className="flex items-center justify-center p-8">
      <div className={`${sizeClass} border-3 border-muted border-t-primary rounded-full animate-spin`} />
    </div>
  );
};

export default LoadingSpinner;
