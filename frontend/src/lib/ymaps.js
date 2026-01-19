// lib/ymaps.js
import React from 'react';
import ReactDom from 'react-dom';

// Функция для ожидания загрузки ymaps3
const waitForYmaps3 = () => {
  return new Promise((resolve, reject) => {
    // Если уже загружен
    if (window.ymaps3) {
      resolve(window.ymaps3);
      return;
    }

    // Проверяем периодически
    const interval = setInterval(() => {
      if (window.ymaps3) {
        clearInterval(interval);
        resolve(window.ymaps3);
      }
    }, 50);

    // Таймаут
    setTimeout(() => {
      clearInterval(interval);
      if (!window.ymaps3) {
        reject(new Error('Yandex Maps API не загружен. Убедитесь, что скрипт подключен в index.html'));
      }
    }, 10000);
  });
};

// Кэш для загруженных компонентов
let ymapsComponents = null;
let loadingPromise = null;

// Функция для ленивой загрузки компонентов карты
export const loadYmapsComponents = async () => {
  // Если уже загружено, возвращаем кэш
  if (ymapsComponents) {
    return ymapsComponents;
  }

  // Если уже идет загрузка, ждем её
  if (loadingPromise) {
    return loadingPromise;
  }

  // Начинаем загрузку
  loadingPromise = (async () => {
    try {
      const ymaps3Instance = await waitForYmaps3();
      const [ymaps3React] = await Promise.all([
        ymaps3Instance.import('@yandex/ymaps3-reactify'),
        ymaps3Instance.ready
      ]);

      // Согласно документации: reactify.bindTo(React, ReactDom)
      const reactifyInstance = ymaps3React.reactify.bindTo(React, ReactDom);
      const reactifiedModule = reactifyInstance.module(ymaps3Instance);

      // Проверяем доступность компонентов и логируем для отладки
      console.log('Доступные компоненты:', Object.keys(reactifiedModule));

      // Извлекаем компоненты с проверкой
      // Из списка доступных: YMapControls есть, но YMapZoomControl и YMapPolyline отсутствуют
      ymapsComponents = {
        reactify: reactifyInstance,
        YMap: reactifiedModule.YMap,
        YMapDefaultSchemeLayer: reactifiedModule.YMapDefaultSchemeLayer,
        YMapDefaultFeaturesLayer: reactifiedModule.YMapDefaultFeaturesLayer,
        YMapMarker: reactifiedModule.YMapMarker,
        YMapControls: reactifiedModule.YMapControls,
        YMapControl: reactifiedModule.YMapControl,
        YMapControlButton: reactifiedModule.YMapControlButton,
        YMapScaleControl: reactifiedModule.YMapScaleControl,
        // YMapPolyline отсутствует, используем YMapFeature для линии
        YMapFeature: reactifiedModule.YMapFeature,
        // YMapListener для обработки событий клика
        YMapListener: reactifiedModule.YMapListener,
        // YMapContext для доступа к экземпляру карты
        YMapContext: reactifiedModule.YMapContext,
      };
      
      // Логируем для отладки
      console.log('Загруженные компоненты:', {
        YMap: !!ymapsComponents.YMap,
        YMapDefaultSchemeLayer: !!ymapsComponents.YMapDefaultSchemeLayer,
        YMapDefaultFeaturesLayer: !!ymapsComponents.YMapDefaultFeaturesLayer,
        YMapMarker: !!ymapsComponents.YMapMarker,
        YMapControls: !!ymapsComponents.YMapControls,
        YMapFeature: !!ymapsComponents.YMapFeature,
      });

      return ymapsComponents;
    } catch (error) {
      console.error('Ошибка загрузки Яндекс карт:', error);
      loadingPromise = null;
      throw error;
    }
  })();

  return loadingPromise;
};

// Экспортируем функции для использования
export const getYmapsComponents = () => ymapsComponents;
