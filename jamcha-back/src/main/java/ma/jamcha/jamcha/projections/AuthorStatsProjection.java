package ma.jamcha.jamcha.projections;

public interface AuthorStatsProjection {
    Long getId();
    String getName();
    String getAvatar();
    Long getArticleCount();
}