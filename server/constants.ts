/**
 * A constant string representing the HTML structure for a loading skeleton of a card component.
 * This skeleton is used to indicate loading state with placeholder elements styled as skeletons.
 *
 * The structure includes:
 * - A button element with class "card".
 * - A div with class "cardBody" containing:
 *   - A div with class "skeleton skeleton-img" for the image placeholder.
 *   - An h2 element with class "skeleton skeleton-title" for the title placeholder.
 *   - A paragraph element with class "skeleton skeleton-text" for the text placeholder.
 *   - A div with class "dates" containing:
 *     - Two divs with class "skeleton-dates" each containing:
 *       - Two paragraph elements with class "skeleton skeleton-text-dates" for date placeholders.
 * - A div with class "tripDetails" containing:
 *   - Four paragraph elements with class "skeleton skeleton-details" for trip details placeholders.
 */
export const cardSkeletonLoading: string =
  ' <button class="card">\
      <div class="cardBody">\
      <div class="skeleton skeleton-img"></div>\
      <h2 class="skeleton skeleton-title"></h2>\
        <p class="skeleton skeleton-text"></p>\
        <div class="dates">\
          <div class="skeleton-dates">\
            <p class="skeleton skeleton-text-dates"></p>\
            <p class="skeleton skeleton-text-dates"></p>\
          </div>\
          <div class="skeleton-dates">\
            <p class="skeleton skeleton-text-dates"></p>\
            <p class="skeleton skeleton-text-dates"></p>\
          </div>\
        </div>\
      </div>\
      <div class="tripDetails">\
        <p class="skeleton skeleton-details"></p>\
        <p class="skeleton skeleton-details"></p>\
        <p class="skeleton skeleton-details"></p>\
        <p class="skeleton skeleton-details"></p>\
      </div>\
    </button>';
