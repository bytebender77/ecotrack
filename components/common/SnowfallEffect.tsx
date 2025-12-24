"use client";

import Snowfall from "react-snowfall";

export default function SnowfallEffect() {
    return (
        <div className="fixed inset-0 pointer-events-none z-40">
            <Snowfall
                color="white"
                snowflakeCount={150}
                radius={[0.5, 3]}
                speed={[0.5, 2]}
                wind={[-0.5, 1]}
                style={{
                    position: "fixed",
                    width: "100vw",
                    height: "100vh",
                }}
            />
        </div>
    );
}
