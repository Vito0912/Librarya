const ProgressBar = ({ progress = 0 }: { progress?: number }) => {
    return (
    <div className="pt-4">
        <div className={`py-1.5 h-4 pt-3 relative ${progress <= 0 ? 'hidden' : ''}`}>
            <div className="absolute top-0 bottom-0 left-0 w-full h-full bg-gray-950 rounded-lg"></div>
            <div
            style={{
                width: `${progress}%`,
            }}
            className="absolute top-0 bottom-0 left-0 h-full transition-all duration-200 bg-gray-800 rounded-lg"
            ></div>
            <div className="absolute top-0 bottom-0 left-0 flex items-center justify-center w-full h-full">
            <span className="text-xs font-bold text-white">{progress} %</span>
            </div>
        </div>
      </div>
    );
  };
  
  export default ProgressBar;