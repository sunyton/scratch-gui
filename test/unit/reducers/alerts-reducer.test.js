// TODO: add tests of extension alerts

/* eslint-env jest */
import {AlertLevels} from '../../../src/lib/alerts/index.jsx';
import alertsReducer from '../../../src/reducers/alerts';
import {
    closeAlert,
    showStandardAlert
} from '../../../src/reducers/alerts';

test('initialState', () => {
    let defaultState;
    /* alertsReducer(state, action) */
    expect(alertsReducer(defaultState, {type: 'anything'})).toBeDefined();
    expect(alertsReducer(defaultState, {type: 'anything'}).visible).toBe(true);
    expect(alertsReducer(defaultState, {type: 'anything'}).alertsList).toEqual([]);
});

test('create one standard alert', () => {
    let defaultState;
    const action = showStandardAlert('saving');
    const resultState = alertsReducer(defaultState, action);
    expect(resultState.alertsList.length).toBe(1);
    expect(resultState.alertsList[0].alertId).toBe('saving');
    expect(resultState.alertsList[0].level).toBe(AlertLevels.SUCCESS);
});

test('add several standard alerts', () => {
    const initialState = {
        visible: true,
        alertsList: [
            {
                alertId: 'saving',
                level: AlertLevels.SUCCESS,
                content: null,
                iconURL: '/no_image_here.jpg'
            }
        ]
    };
    const action = showStandardAlert('creating');
    let resultState = alertsReducer(initialState, action);
    resultState = alertsReducer(resultState, action);
    resultState = alertsReducer(resultState, action);
    expect(resultState.alertsList.length).toBe(4);
    expect(resultState.alertsList[0].iconURL).toBe('/no_image_here.jpg');
    expect(resultState.alertsList[1].alertId).toBe('creating');
    expect(resultState.alertsList[2].alertId).toBe('creating');
    expect(resultState.alertsList[3].alertId).toBe('creating');
});

test('can close alerts by index', () => {
    const initialState = {
        visible: true,
        alertsList: [
            {
                alertId: 'saving',
                level: AlertLevels.SUCCESS,
                content: null,
                iconURL: '/no_image_here.jpg'
            }
        ]
    };
    const createAction = showStandardAlert('creating');
    let resultState = alertsReducer(initialState, createAction);
    resultState = alertsReducer(resultState, createAction);
    resultState = alertsReducer(resultState, createAction);
    const closeAction = closeAlert(1);
    resultState = alertsReducer(resultState, closeAction);
    resultState = alertsReducer(resultState, closeAction);
    expect(resultState.alertsList.length).toBe(2);
    expect(resultState.alertsList[0].alertId).toBe('saving');
    expect(resultState.alertsList[1].alertId).toBe('creating');
});

test('related alerts can clear each other', () => {
    const initialState = {
        visible: true,
        alertsList: [
            {
                alertId: 'saving',
                level: AlertLevels.SUCCESS,
                content: null,
                iconURL: '/no_image_here.jpg'
            },
            {
                alertId: 'creating',
                level: AlertLevels.SUCCESS,
                content: null,
                iconURL: '/no_image_here.jpg'
            }
        ]
    };
    const action = showStandardAlert('saveSuccess');
    const resultState = alertsReducer(initialState, action);
    expect(resultState.alertsList.length).toBe(2);
    expect(resultState.alertsList[0].alertId).toBe('creating');
    expect(resultState.alertsList[1].alertId).toBe('saveSuccess');
});

test('several related alerts can be cleared at once', () => {
    const initialState = {
        visible: true,
        alertsList: []
    };
    const createAction = showStandardAlert('creating');
    let resultState = alertsReducer(initialState, createAction);
    resultState = alertsReducer(resultState, createAction);
    resultState = alertsReducer(resultState, createAction);
    const createSuccessAction = showStandardAlert('createSuccess');
    resultState = alertsReducer(resultState, createSuccessAction);
    expect(resultState.alertsList.length).toBe(1);
    expect(resultState.alertsList[0].alertId).toBe('createSuccess');
});
