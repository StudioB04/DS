export default () => (
  <g>
    <style>{`
      #back,
      #front {
        fill: none;
        stroke: currentColor;
        stroke-width: 1.5;
        stroke-linecap: round;
        stroke-linejoin: round;
      }

      #back {
        opacity: 0.1;
      }

      #front {
        stroke-dasharray: 50, 150;
        stroke-dashoffset: 200;
        animation: dash 1.2s ease-out infinite;
      }

      @keyframes dash {
        to {
          stroke-dashoffset: 0;
        }
      }
    `}</style>

    <polyline id="back" points="0.059 8.984, 5.25 8.984, 8.191 18, 16.125 0, 18.75 9, 24 9" />
    <polyline id="front" points="0.059 8.984, 5.25 8.984, 8.191 18, 16.125 0, 18.75 9, 24 9" />
  </g>
);
