package ma.jamcha.jamcha.entities;

import jakarta.persistence.*;
import lombok.Data;
import ma.jamcha.jamcha.enums.SocialProvider;

import java.util.EnumSet;
import java.util.Objects;

@Entity
@Data
@Table(name = "social_media_links")
public class SocialMediaLink {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Enumerated(EnumType.STRING)
    private SocialProvider socialProvider;
    private String url;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "article_id")
    private Article article;


    public SocialMediaLink(Long id, SocialProvider socialProvider, String url) {
        this.id = id;
        this.socialProvider = socialProvider;
        this.url = url;
    }

    public SocialMediaLink() {

    }

    public SocialMediaLink(SocialProvider socialProvider, String url) {
        this.socialProvider = socialProvider;
        this.url = url;
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        SocialMediaLink that = (SocialMediaLink) o;
        return Objects.equals(id, that.id) && socialProvider == that.socialProvider && Objects.equals(url, that.url);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, socialProvider, url);
    }

    @Override
    public String toString() {
        return "SocialMediaLink{" +
                "id=" + id +
                ", socialProvider=" + socialProvider +
                ", url='" + url + '\'' +
                '}';
    }
}

