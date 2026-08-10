const BloodBadge = ({ group }) => (
    <div className="h-16 w-14 shrink-0">
        <svg
            viewBox="0 0 100 120"
            className="h-full w-full drop-shadow-sm"
            fill="#dc2626"
        >
            <path d="M50 0 C75 25 95 45 95 70 A45 45 0 1 1 5 70 C5 45 25 25 50 0Z" />

            <text
                x="50"
                y="68"
                textAnchor="middle"
                fill="white"
                fontSize="24"
                fontWeight="bold"
            >
                {group}
            </text>
        </svg>
    </div>
);

export default BloodBadge;