type AppLoaderProps={compact?:boolean};
export default function AppLoader({compact=false}:AppLoaderProps){return <div className={`pickem-loader${compact?' pickem-loader--compact':''}`} role="status" aria-label="Loading"><div className="pickem-loader__mark" aria-hidden="true"><i/><i/><i/><i/><i/></div></div>}
