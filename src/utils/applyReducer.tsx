import {
  createContext,
  useReducer,
  Dispatch,
  Reducer,
  memo,
  Children,
  cloneElement,
  useContext,
  useEffect,
} from "react";
import { pipe } from "@mobily/ts-belt";

type DependencyFn<Props, State> = (props: Props, state: State) => any[];
type EffectFn<Props, State, EventType> = (reducer: {
  state: State;
  dispatch: Dispatch<EventType>;
  props: Props;
}) => void | EffectFn<Props, State, EventType>;
type Effects<Props, State, EventType> = [
  EffectFn<Props, State, EventType>,
  DependencyFn<Props, State>
][];

export const createEffect = <Props, State, Event>(
  effect: EffectFn<Props, State, Event>,
  dependencyFn: DependencyFn<Props, State>
): [EffectFn<Props, State, Event>, DependencyFn<Props, State>] => [
  effect,
  dependencyFn,
];

type ReducerReturnType = ReturnType<typeof useReducer>;
type ReducerContextType<State> = {
  defaultState: State;
  r: ReducerReturnType;
};
type ReducerContextReturn<State, EventType> = State & {
  dispatch: Dispatch<EventType>;
};

type ApplyReducerComponentType<Props, State, EventType, SelectorReturn> =
  React.ComponentType<
    Readonly<Props & ReducerContextReturn<State, EventType> & SelectorReturn>
  >;
type ApplyReducerFunc<State, EventType> = <
  Props,
  SelectorReturn extends any = {}
>(
  Component: ApplyReducerComponentType<Props, State, EventType, SelectorReturn>
) => (props: Props) => React.JSX.Element;

type ApplyContextReducerFunc<
  State,
  EventType,
  SelectorReturn extends any = {}
> = [
  <Props>(
    Component: ApplyReducerComponentType<
      Props,
      State,
      EventType,
      SelectorReturn
    >,
    effects?: Effects<Props, State, EventType>
  ) => (props: Props) => React.JSX.Element,
  <Props>(
    Component: ApplyReducerComponentType<
      Props,
      State,
      EventType,
      SelectorReturn
    >,
    effects?: Effects<Props, State, EventType>
  ) => (props: Props) => React.JSX.Element
];

type SelectorType<State> = (state: State) => Record<string, unknown>;
type ReducerWrapperParam<
  State,
  Event,
  ConsumerType = React.Consumer<ReducerContextType<State>>,
  ReducerType = React.Provider<ReducerContextType<State>>
> = {
  Consumer: ConsumerType;
  Provider: ReducerType;
  defaultState: State;
  selector?: SelectorType<State>;
  reducer: Reducer<State, Event>;
};

const createLocalContext = <State,>(initialValue: State) => {
  type RenderFunction = (value: State) => React.ReactNode;
  type LocalProps = {
    value: State;
    children: React.ReactNode | RenderFunction;
  };
  const Provider: any = ({ value = initialValue, children }: LocalProps) =>
    Children.map(children as React.ReactElement, (child) =>
      cloneElement(child, { value })
    );
  const Consumer: any = ({ value = initialValue, children }: LocalProps) =>
    (children as RenderFunction)(value);

  return { Provider: memo(Provider), Consumer: memo(Consumer) };
};

const createReducerWrapper =
  <State, Event>({
    Consumer,
    Provider,
    defaultState,
    selector,
    reducer,
  }: ReducerWrapperParam<State, Event>): ApplyReducerFunc<State, Event> =>
  <Props,>(Component: React.ElementType) =>
  (props: Props) =>
    (
      <Provider
        value={{
          defaultState,
          r: useReducer(reducer, defaultState),
        }}
      >
        <Consumer>
          {({ r: [state, dispatch] }) => (
            <Component
              {...props}
              {...state}
              {...(selector ? selector(state) : {})}
              dispatch={dispatch as Dispatch<Event>}
            />
          )}
        </Consumer>
      </Provider>
    );

type EffectRunnerProps<Props, State, EventType> = {
  effects?: Effects<Props, State, EventType>;
  state: State;
  dispatch: Dispatch<EventType>;
  props: Props;
};
const EffectRunner = <Props, State, EventType>({
  props,
  children,
  effects,
  state,
  dispatch,
}: React.PropsWithChildren<
  EffectRunnerProps<Props, State, EventType>
>): any => {
  if (!effects) return children;
  effects.forEach(([effect, dependencyFn]) => {
    useEffect(() => {
      const returnFn = effect({ state, dispatch, props });
      if (typeof returnFn === "function") {
        return () => returnFn({ state, dispatch, props })!;
      }
      return () => {};
    }, dependencyFn(props, state));
  });
  return children;
};

const createContextReducerWrapper = <State, Event>({
  Consumer,
  Provider,
  defaultState,
  selector,
  reducer,
}: ReducerWrapperParam<State, Event>) => {
  const WrappedProvider = ({ children }: React.PropsWithChildren) => (
    <Provider
      value={{
        defaultState,
        r: useReducer(reducer, defaultState),
      }}
    >
      {children}
    </Provider>
  );

  return <Props,>(
      Component: React.ElementType,
      effects?: Effects<Props, State, Event>
    ) =>
    (props: Props) =>
      (
        <WrappedProvider>
          <Consumer>
            {({ r: [state, dispatch] }) => (
              <EffectRunner
                effects={effects}
                state={state}
                dispatch={dispatch}
                props={props}
              >
                <Component
                  {...props}
                  {...state}
                  {...(selector ? selector(state) : {})}
                  dispatch={dispatch as Dispatch<Event>}
                />
              </EffectRunner>
            )}
          </Consumer>
        </WrappedProvider>
      );
};

const createContextReducerConsumer =
  <State, Event>(
    context: React.Context<ReducerContextType<State>>,
    selector?: SelectorType<State>
  ) =>
  <Props, SelectorReturn>(
    Component: React.ElementType,
    effects?: Effects<Props, State, Event>
  ) =>
  (props: Props) => {
    const { r } = useContext(context);
    const [state, dispatch] = r;

    return (
      <EffectRunner
        effects={effects}
        state={state}
        dispatch={dispatch}
        props={props}
      >
        <Component
          {...props}
          {...state}
          {...(selector ? selector(state) : {})}
          dispatch={dispatch as Dispatch<Event>}
        />
      </EffectRunner>
    );
  };

const createApplyReducer = <State, Event>(
  reducer: Reducer<State, Event>,
  defaultState: State,
  selector?: SelectorType<State>
) =>
  pipe(
    createLocalContext<ReducerContextType<State>>({
      defaultState,
      r: {} as ReducerReturnType,
    }),
    ({ Consumer, Provider }) =>
      createReducerWrapper<State, Event>({
        Consumer,
        Provider,
        defaultState,
        selector,
        reducer,
      })
  );

const createApplyContextReducer = <
  State,
  Event,
  SelectorReturn extends any = {}
>(
  reducer: Reducer<State, Event>,
  defaultState: State,
  selector?: SelectorType<State>
): ApplyContextReducerFunc<State, Event, SelectorReturn> =>
  pipe(
    createContext<ReducerContextType<State>>({
      defaultState,
      r: {} as ReducerReturnType,
    }),
    (Context) => [
      createContextReducerWrapper<State, Event>({
        Consumer: Context.Consumer,
        Provider: Context.Provider,
        defaultState,
        selector,
        reducer,
      }),
      createContextReducerConsumer<State, Event>(Context, selector),
    ]
  );

export { createApplyReducer, createApplyContextReducer };
