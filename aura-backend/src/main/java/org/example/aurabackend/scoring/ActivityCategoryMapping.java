package org.example.aurabackend.scoring;

import org.example.aurabackend.enumeration.SideQuestCategory;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

/**
 * Maps activities to SideQuestCategory values.
 *
 * This central mapping prevents hardcoded activity-category relationships
 * scattered throughout the codebase. The scorer reads this mapping instead
 * of using if-else chains.
 *
 * Activities are normalized to lowercase for matching.
 *
 * Performance optimization:
 *   - The mapping is immutable after initialization (unmodifiableMap)
 *   - No repeated computation needed
 *   - Thread-safe for concurrent access
 *
 * Future extensibility:
 *   - Activities can be loaded from configuration files
 *   - Machine learning can suggest new mappings
 *   - User-specific overrides can be supported
 */
@Component
public class ActivityCategoryMapping {

    private final Map<String, String> activityToCategoryMap;

    public ActivityCategoryMapping() {
        Map<String, String> mutableMap = initializeMapping();
        this.activityToCategoryMap = Collections.unmodifiableMap(mutableMap);
    }

    /**
     * Gets the category for a given activity.
     *
     * @param activityName the activity name (case-insensitive)
     * @return the category name, or null if not found
     */
    public String getCategoryForActivity(String activityName) {
        if (activityName == null) {
            return null;
        }
        return activityToCategoryMap.get(activityName.toLowerCase().trim());
    }

    /**
     * Initializes the activity-to-category mapping.
     *
     * This mapping can be extended with more activities over time.
     * Consider loading from configuration files in production.
     */
    private Map<String, String> initializeMapping() {
        Map<String, String> mapping = new HashMap<>();

        // EXERCISE activities
        mapping.put("đi bộ", SideQuestCategory.EXERCISE.name());
        mapping.put("chạy bộ", SideQuestCategory.EXERCISE.name());
        mapping.put("running", SideQuestCategory.EXERCISE.name());
        mapping.put("jogging", SideQuestCategory.EXERCISE.name());
        mapping.put("gym", SideQuestCategory.EXERCISE.name());
        mapping.put("tập gym", SideQuestCategory.EXERCISE.name());
        mapping.put("tập thể dục", SideQuestCategory.EXERCISE.name());
        mapping.put("bơi lội", SideQuestCategory.EXERCISE.name());
        mapping.put("swimming", SideQuestCategory.EXERCISE.name());
        mapping.put("đạp xe", SideQuestCategory.EXERCISE.name());
        mapping.put("cycling", SideQuestCategory.EXERCISE.name());
        mapping.put("yoga", SideQuestCategory.EXERCISE.name());
        mapping.put("pilates", SideQuestCategory.EXERCISE.name());
        mapping.put("thể thao", SideQuestCategory.EXERCISE.name());
        mapping.put("sports", SideQuestCategory.EXERCISE.name());

        // MINDFULNESS activities
        mapping.put("thiền", SideQuestCategory.MINDFULNESS.name());
        mapping.put("meditation", SideQuestCategory.MINDFULNESS.name());
        mapping.put("tập trung", SideQuestCategory.MINDFULNESS.name());
        mapping.put("focus", SideQuestCategory.MINDFULNESS.name());
        mapping.put("hít thở sâu", SideQuestCategory.MINDFULNESS.name());
        mapping.put("deep breathing", SideQuestCategory.MINDFULNESS.name());
        mapping.put("chánh niệm", SideQuestCategory.MINDFULNESS.name());
        mapping.put("mindfulness", SideQuestCategory.MINDFULNESS.name());

        // CREATIVITY activities
        mapping.put("đọc sách", SideQuestCategory.CREATIVITY.name());
        mapping.put("reading", SideQuestCategory.CREATIVITY.name());
        mapping.put("viết", SideQuestCategory.CREATIVITY.name());
        mapping.put("writing", SideQuestCategory.CREATIVITY.name());
        mapping.put("vẽ", SideQuestCategory.CREATIVITY.name());
        mapping.put("drawing", SideQuestCategory.CREATIVITY.name());
        mapping.put("hội họa", SideQuestCategory.CREATIVITY.name());
        mapping.put("painting", SideQuestCategory.CREATIVITY.name());
        mapping.put("nhạc", SideQuestCategory.CREATIVITY.name());
        mapping.put("music", SideQuestCategory.CREATIVITY.name());
        mapping.put("chơi nhạc cụ", SideQuestCategory.CREATIVITY.name());
        mapping.put("playing instrument", SideQuestCategory.CREATIVITY.name());
        mapping.put("nấu ăn", SideQuestCategory.CREATIVITY.name());
        mapping.put("cooking", SideQuestCategory.CREATIVITY.name());
        mapping.put("nhiếp ảnh", SideQuestCategory.CREATIVITY.name());
        mapping.put("photography", SideQuestCategory.CREATIVITY.name());
        mapping.put("làm thủ công", SideQuestCategory.CREATIVITY.name());
        mapping.put("crafts", SideQuestCategory.CREATIVITY.name());

        // SOCIAL activities
        mapping.put("gặp gỡ bạn bè", SideQuestCategory.SOCIAL.name());
        mapping.put("meeting friends", SideQuestCategory.SOCIAL.name());
        mapping.put("họp nhóm", SideQuestCategory.SOCIAL.name());
        mapping.put("group meeting", SideQuestCategory.SOCIAL.name());
        mapping.put("đi chơi", SideQuestCategory.SOCIAL.name());
        mapping.put("hanging out", SideQuestCategory.SOCIAL.name());
        mapping.put("gia đình", SideQuestCategory.SOCIAL.name());
        mapping.put("family", SideQuestCategory.SOCIAL.name());
        mapping.put("tiệc", SideQuestCategory.SOCIAL.name());
        mapping.put("party", SideQuestCategory.SOCIAL.name());
        mapping.put(" trò chuyện", SideQuestCategory.SOCIAL.name());
        mapping.put("chatting", SideQuestCategory.SOCIAL.name());

        // PRODUCTIVITY activities
        mapping.put("học tập", SideQuestCategory.PRODUCTIVITY.name());
        mapping.put("studying", SideQuestCategory.PRODUCTIVITY.name());
        mapping.put("làm việc", SideQuestCategory.PRODUCTIVITY.name());
        mapping.put("working", SideQuestCategory.PRODUCTIVITY.name());
        mapping.put("lập trình", SideQuestCategory.PRODUCTIVITY.name());
        mapping.put("programming", SideQuestCategory.PRODUCTIVITY.name());
        mapping.put("coding", SideQuestCategory.PRODUCTIVITY.name());
        mapping.put("nghiên cứu", SideQuestCategory.PRODUCTIVITY.name());
        mapping.put("research", SideQuestCategory.PRODUCTIVITY.name());
        mapping.put("dự án", SideQuestCategory.PRODUCTIVITY.name());
        mapping.put("project", SideQuestCategory.PRODUCTIVITY.name());
        mapping.put("lập kế hoạch", SideQuestCategory.PRODUCTIVITY.name());
        mapping.put("planning", SideQuestCategory.PRODUCTIVITY.name());
        mapping.put("tổ chức", SideQuestCategory.PRODUCTIVITY.name());
        mapping.put("organizing", SideQuestCategory.PRODUCTIVITY.name());

        // SELF_CARE activities
        mapping.put("ngủ", SideQuestCategory.SELF_CARE.name());
        mapping.put("sleeping", SideQuestCategory.SELF_CARE.name());
        mapping.put("nghỉ ngơi", SideQuestCategory.SELF_CARE.name());
        mapping.put("resting", SideQuestCategory.SELF_CARE.name());
        mapping.put("spa", SideQuestCategory.SELF_CARE.name());
        mapping.put("massage", SideQuestCategory.SELF_CARE.name());
        mapping.put("tắm", SideQuestCategory.SELF_CARE.name());
        mapping.put("bathing", SideQuestCategory.SELF_CARE.name());
        mapping.put("chăm sóc bản thân", SideQuestCategory.SELF_CARE.name());
        mapping.put("self care", SideQuestCategory.SELF_CARE.name());

        // HEALTH activities
        mapping.put("khám sức khỏe", SideQuestCategory.HEALTH.name());
        mapping.put("health check", SideQuestCategory.HEALTH.name());
        mapping.put("bác sĩ", SideQuestCategory.HEALTH.name());
        mapping.put("doctor", SideQuestCategory.HEALTH.name());
        mapping.put("thuốc", SideQuestCategory.HEALTH.name());
        mapping.put("medicine", SideQuestCategory.HEALTH.name());
        mapping.put("ăn uống lành mạnh", SideQuestCategory.HEALTH.name());
        mapping.put("healthy eating", SideQuestCategory.HEALTH.name());
        mapping.put("chế độ ăn", SideQuestCategory.HEALTH.name());
        mapping.put("diet", SideQuestCategory.HEALTH.name());

        return mapping;
    }

    /**
     * Checks if an activity has a known category mapping.
     *
     * @param activityName the activity name
     * @return true if mapped, false otherwise
     */
    public boolean hasMapping(String activityName) {
        if (activityName == null) {
            return false;
        }
        return activityToCategoryMap.containsKey(activityName.toLowerCase().trim());
    }

    /**
     * Gets the total number of mapped activities.
     *
     * @return count of mapped activities
     */
    public int getMappingCount() {
        return activityToCategoryMap.size();
    }
}
