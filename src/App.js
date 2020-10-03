/* eslint-disable */

import * as React from "react"
import AbsoluteGitHubCallout from "AbsoluteGitHubCallout"
import createID from "createID"
import css from "tpl"
import px from "px"
import StyleOnce from "./StyleOnce"
import SVGGitHubCallout from "SVGGitHubCallout"
import useMethods from "use-methods"
import useSorceryReducer from "useSorceryReducer"
import { v4 as uuidv4 } from "uuid"

/****/

const debugStateID = createID()

function DebugState({ state }) {
	return (
		<>
			{/**/}

			<StyleOnce id={debugStateID}>
				{css`
					.absolute__${debugStateID} {
						padding-top: ${px(12)};
						padding-right: ${px(12)};
						padding-bottom: ${px(12)};
						padding-left: ${px(12)};
						position: absolute;
						bottom: 0;
						left: 0;
						width: ${px(320)};
					}
					.debugState__${debugStateID} {
						white-space: pre;
						font-family: monospace;
					}
				`}
			</StyleOnce>

			<div className={`absolute__${debugStateID}`}>
				<div className={`debugState__${debugStateID}`}>{JSON.stringify(state, null, 2)}</div>
			</div>
		</>
	)
}

/****/

const debugActiveElementID = createID()

function DebugActiveElement({ activeElement }) {
	return (
		<>
			{/**/}

			<StyleOnce id={debugActiveElementID}>
				{css`
					.absolute__${debugActiveElementID} {
						padding-top: ${px(8)};
						padding-right: ${px(8)};
						padding-bottom: ${px(8)};
						padding-left: ${px(8)};
						position: absolute;
						top: ${activeElement.style.height < 32 ? "100%" : "auto"};
						right: 0;
						bottom: ${activeElement.style.height < 32 ? "auto" : "0"};
						user-select: none;
					}
					.debugActiveElement__${debugActiveElementID} {
						white-space: pre;
						font-family: monospace;
					}
				`}
			</StyleOnce>

			<div className={`absolute__${debugActiveElementID}`}>
				<div className={`debugActiveElement__${debugActiveElementID}`}>{activeElement.style.height}px</div>
			</div>

			{/**/}
		</>
	)
}

/****/

const activeElementID = createID()
const handleBarID = createID()
const snapToEdgeID = createID()

export default function App() {
	const [state, actions] = useSorceryReducer()

	// Manages key down.
	React.useEffect(() => {
		const handler = e => {
			if (e.key === "Shift" || e.keyCode === 16 || e.shiftKey) {
				actions.keyDownShift()
			} else if (e.key === "Backspace" || e.keyCode === 8) {
				actions.keyDownDeleteActiveElement()
			}
		}
		document.addEventListener("keydown", handler)
		return () => {
			document.removeEventListener("keydown", handler)
		}
	}, [actions])

	// Manages key up.
	React.useEffect(() => {
		document.addEventListener("keyup", actions.keyUp)
		return () => {
			document.removeEventListener("keyup", actions.keyUp)
		}
	}, [actions])

	const dep = state.activeElement && state.activeElement.focusState.handleBar
	React.useEffect(
		React.useCallback(() => {
			const id = setTimeout(() => {
				const element = document.querySelector("[class^='handleBarHitArea']")
				if (element) {
					if (state.activeElement.focusState.handleBar) {
						element.focus()
					} else {
						element.blur()
					}
				}
			}, 0)
			return () => {
				clearTimeout(id)
			}
		}, [state]),
		[dep],
	)

	return (
		<>
			{/**/}

			<AbsoluteGitHubCallout />

			<div
				style={{ height: "100vh" }}
				onPointerDown={actions.handlePointerDown}
				onPointerMove={e => {
					actions.handlePointerMove({
						x: Math.round(e.clientX),
						y: Math.round(e.clientY),
					})
				}}
				onPointerUp={actions.handlePointerUp}
			>
				{state.activeElement && (
					<>
						{/**/}

						{/* activeElement */}
						<StyleOnce id={activeElementID}>
							{css`
								.activeElement__${activeElementID}:focus {
									outline: none;
								}
								.activeElement__${activeElementID}[data-focus="false"] {
									background-color: hsl(${3.25 * 60}, 100%, 90%);
									transition-property: background-color;
									transition-duration: 100ms;
									transition-timing-function: ease-out;
								}
								.activeElement__${activeElementID}[data-focus="true"] {
									background-color: hsl(${3.25 * 60}, 100%, 75%);
									transition-property: background-color;
									transition-duration: 50ms;
									transition-timing-function: ease-out;
								}
							`}
						</StyleOnce>

						<div
							className={`activeElement__${activeElementID}`}
							style={state.activeElement.style}
							onFocus={actions.focusActiveElement}
							onBlur={e => {
								if (!e.target.contains(e.relatedTarget)) {
									actions.blurActiveElement()
								}
							}}
							data-focus={state.activeElement.focusState.element}
							tabIndex={0}
						>
							<div style={{ position: "relative", height: "100%" }}>
								{/**/}

								{/* debugActiveElement */}
								<DebugActiveElement activeElement={state.activeElement} />

								{/* activeElement */}
								{state.activeElement.focusState.element && (
									<>
										<StyleOnce id={handleBarID}>
											{css`
												.absolute__${handleBarID} {
													position: absolute;
													top: 100%;
													right: 0;
													left: 0;
													display: flex;
													justify-content: center;
													align-items: center;
												}
												.handleBarHitArea__${handleBarID} {
													padding-top: ${px(6)};
													padding-right: ${px(6)};
													padding-bottom: ${px(6)};
													padding-left: ${px(6)};
												}
												.handleBarHitArea__${handleBarID}:focus {
													outline: none;
												}
												.handleBar__${handleBarID} {
													width: ${px(72)};
													height: ${px(6)};
													border-radius: 9999px;
													background-color: hsl(${3.25 * 60}, 100%, 90%);
												}
												.handleBarHitArea__${handleBarID}[data-focus="true"] .handleBar__${handleBarID} {
													background-color: hsl(${3.25 * 60}, 100%, 75%);
												}
											`}
										</StyleOnce>

										<div className={`absolute__${handleBarID}`}>
											<div
												className={`handleBarHitArea__${handleBarID}`}
												onFocus={actions.focusActiveElementHandleBar}
												onBlur={actions.blurActiveElementHandleBar}
												data-focus={state.activeElement.focusState.handleBar}
												tabIndex={0}
											>
												<div className={`handleBar__${handleBarID}`} />
											</div>
										</div>
									</>
								)}

								{/**/}
							</div>
						</div>

						{/* snapToEdge */}
						{/* {state.pointer.y / window.innerHeight >= 0.75 && ( */}
						{window.innerHeight - state.pointer.y < 64 && (
							<>
								{/**/}

								<StyleOnce id={snapToEdgeID}>
									{css`
										.absolute__${snapToEdgeID} {
											position: absolute;
											right: 0;
											bottom: 0;
											left: 0;
										}
										.center__${snapToEdgeID} {
											display: flex;
											justify-content: center;
										}
										.snapToEdge__${snapToEdgeID} {
											width: 100%;
											height: ${px(4)};
											background-color: hsl(${3.25 * 60}, 100%, 75%);
										}
									`}
								</StyleOnce>

								<div className={`absolute__${snapToEdgeID}`}>
									<div className={`center__${snapToEdgeID}`}>
										<div className={`snapToEdge__${snapToEdgeID}`} />
									</div>
								</div>

								{/**/}
							</>
						)}

						{/**/}
					</>
				)}
			</div>

			<DebugState state={state} />

			{/**/}
		</>
	)
}
