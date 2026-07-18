package org.example.aurabackend.scoring;

import org.example.aurabackend.enumeration.SideQuestCategory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Unit tests for ActivityCategoryMapping.
 */
class ActivityCategoryMappingTest {

    private ActivityCategoryMapping mapping;

    @BeforeEach
    void setUp() {
        mapping = new ActivityCategoryMapping();
    }

    @Test
    @DisplayName("ActivityCategoryMapping maps Vietnamese exercise activities correctly")
    void mapsVietnameseExerciseActivities() {
        assertThat(mapping.getCategoryForActivity("đi bộ")).isEqualTo(SideQuestCategory.EXERCISE.name());
        assertThat(mapping.getCategoryForActivity("chạy bộ")).isEqualTo(SideQuestCategory.EXERCISE.name());
        assertThat(mapping.getCategoryForActivity("tập gym")).isEqualTo(SideQuestCategory.EXERCISE.name());
    }

    @Test
    @DisplayName("ActivityCategoryMapping maps English exercise activities correctly")
    void mapsEnglishExerciseActivities() {
        assertThat(mapping.getCategoryForActivity("running")).isEqualTo(SideQuestCategory.EXERCISE.name());
        assertThat(mapping.getCategoryForActivity("swimming")).isEqualTo(SideQuestCategory.EXERCISE.name());
        assertThat(mapping.getCategoryForActivity("yoga")).isEqualTo(SideQuestCategory.EXERCISE.name());
    }

    @Test
    @DisplayName("ActivityCategoryMapping maps creativity activities correctly")
    void mapsCreativityActivities() {
        assertThat(mapping.getCategoryForActivity("đọc sách")).isEqualTo(SideQuestCategory.CREATIVITY.name());
        assertThat(mapping.getCategoryForActivity("reading")).isEqualTo(SideQuestCategory.CREATIVITY.name());
        assertThat(mapping.getCategoryForActivity("vẽ")).isEqualTo(SideQuestCategory.CREATIVITY.name());
        assertThat(mapping.getCategoryForActivity("nấu ăn")).isEqualTo(SideQuestCategory.CREATIVITY.name());
    }

    @Test
    @DisplayName("ActivityCategoryMapping maps mindfulness activities correctly")
    void mapsMindfulnessActivities() {
        assertThat(mapping.getCategoryForActivity("thiền")).isEqualTo(SideQuestCategory.MINDFULNESS.name());
        assertThat(mapping.getCategoryForActivity("meditation")).isEqualTo(SideQuestCategory.MINDFULNESS.name());
        assertThat(mapping.getCategoryForActivity("tập trung")).isEqualTo(SideQuestCategory.MINDFULNESS.name());
    }

    @Test
    @DisplayName("ActivityCategoryMapping handles case insensitivity")
    void handlesCaseInsensitivity() {
        assertThat(mapping.getCategoryForActivity("ĐI BỘ")).isEqualTo(SideQuestCategory.EXERCISE.name());
        assertThat(mapping.getCategoryForActivity("Reading")).isEqualTo(SideQuestCategory.CREATIVITY.name());
        assertThat(mapping.getCategoryForActivity("YOGA")).isEqualTo(SideQuestCategory.EXERCISE.name());
    }

    @Test
    @DisplayName("ActivityCategoryMapping handles whitespace trimming")
    void handlesWhitespaceTrimming() {
        assertThat(mapping.getCategoryForActivity(" đi bộ ")).isEqualTo(SideQuestCategory.EXERCISE.name());
        assertThat(mapping.getCategoryForActivity("reading ")).isEqualTo(SideQuestCategory.CREATIVITY.name());
    }

    @Test
    @DisplayName("ActivityCategoryMapping returns null for unknown activities")
    void returnsNullForUnknownActivities() {
        assertThat(mapping.getCategoryForActivity("unknown activity")).isNull();
        assertThat(mapping.getCategoryForActivity(null)).isNull();
    }

    @Test
    @DisplayName("ActivityCategoryMapping hasMapping returns correct boolean")
    void hasMappingReturnsCorrectBoolean() {
        assertThat(mapping.hasMapping("đi bộ")).isTrue();
        assertThat(mapping.hasMapping("reading")).isTrue();
        assertThat(mapping.hasMapping("unknown activity")).isFalse();
        assertThat(mapping.hasMapping(null)).isFalse();
    }

    @Test
    @DisplayName("ActivityCategoryMapping getMappingCount returns positive number")
    void getMappingCountReturnsPositiveNumber() {
        assertThat(mapping.getMappingCount()).isGreaterThan(0);
    }
}
